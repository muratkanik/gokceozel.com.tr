<?php
// SerpService.php - Handles Serper.dev API (Google Search Wrapper)
class SerpService {
    private $apiKey;

    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }

    public function search($query, $limit = 20) {
        if (empty($this->apiKey)) {
            return ['error' => 'Serper.dev API Key missing.'];
        }

        $url = 'https://google.serper.dev/search';
        $data = json_encode([
            'q' => $query,
            'num' => $limit,
            'gl' => 'tr', // Geolocation: Turkey
            'hl' => 'tr'  // Language: Turkish
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'X-API-KEY: ' . $this->apiKey,
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $response = curl_exec($ch);
        
        if (curl_errno($ch)) {
            return ['error' => 'Curl error: ' . curl_error($ch)];
        }
        curl_close($ch);

        $data = json_decode($response, true);
        
        if (isset($data['message'])) {
             // Serper error usually comes in 'message'
            return ['error' => 'Serper API Error: ' . $data['message']];
        }

        $results = [];
        if (!empty($data['organic'])) {
            foreach ($data['organic'] as $item) {
                // Determine snippet (Serper uses 'snippet')
                $snippet = isset($item['snippet']) ? $item['snippet'] : '';
                
                $results[] = [
                    'title' => $item['title'],
                    'link' => $item['link'],
                    'snippet' => $snippet
                ];
                
                if (count($results) >= $limit) break;
            }
        }

        return ['results' => $results];
    }
}
?>
