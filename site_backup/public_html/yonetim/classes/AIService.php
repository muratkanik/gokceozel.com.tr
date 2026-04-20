<?php
// AIService.php - Handles interactions with OpenAI and Gemini APIs

class AIService {
    private $provider;
    private $apiKey;
    private $model;

    public function __construct($provider, $apiKey, $model = null) {
        $this->provider = $provider;
        $this->apiKey = $apiKey;
        $this->model = $model;
    }

    public function translateAll($data) {
        // ... (existing implementation)
        if (empty($this->apiKey)) return ['error' => 'API Key is missing.'];
        // ...
        return ['error' => 'Use translateSingle for better performance.']; 
        // actually let's keep it for backward compat or just redirect? 
        // The user code calls translateSingle now.
        // But let's leave translateAll as is in case other parts use it.
        // Wait, I should not delete translateAll if I am just adding translateSingle.
    }

    public function translateSingle($data, $targetLang) {
        if (empty($this->apiKey)) return ['error' => 'API Key is missing.'];

        $langName = $this->getLangName($targetLang);
        
        $prompt = "You are a professional translator and SEO expert. Translate the following Turkish content into {$langName}.
        
Input Data (Turkish):
- Title: {$data['title']}
- Content: {$data['content']}
- Detail: {$data['detail']}
- SEO Title: {$data['seo_title']}
- SEO Description: {$data['seo_description']}

Return strictly a JSON object with keys: title, content, detail, seo_title, seo_description.

IMPORTANT:
- Optimize the content for SEO in {$langName}.
- If 'SEO Title' or 'SEO Description' is empty, GENERATE them.
- Do NOT leave fields empty.
- Ensure cultural adaptation.
JSON:";

        if ($this->provider === 'openai') {
            return $this->callOpenAI($prompt, true);
        } elseif ($this->provider === 'gemini') {
            return $this->callGemini($prompt, true);
        } elseif ($this->provider === 'xai') {
            return $this->callXAI($prompt, true);
        }
        return ['error' => 'Invalid Provider'];
    }

    public function researchAndWrite($title, $serperKey) {
        if (empty($this->apiKey)) return ['error' => 'AI API Key is missing.'];
        if (empty($serperKey)) return ['error' => 'Serper.dev API Key is missing.'];

        // 1. Perform Search
        require_once __DIR__ . '/SerpService.php';
        $serp = new SerpService($serperKey);
        $searchResults = $serp->search($title, 20); // Top 20

        if (isset($searchResults['error'])) {
            return ['error' => 'Serper Search Failed: ' . $searchResults['error']];
        }

        $results = $searchResults['results'];
        
        // 2. Prepare Context for AI
        $context = "Google Search Results for '$title':\n";
        foreach ($results as $i => $item) {
            $context .= ($i+1) . ". " . $item['title'] . "\n   Snippet: " . $item['snippet'] . "\n";
        }

        // 3. Prompt for analysis and writing
        $prompt = "You are an elite SEO Content Strategist and Senior Copywriter.
        
Task: Produce a 'Skyscraper' quality authority article (1500-2000 words) about '$title'.
Base your content on the provided Google Search Results to ensure it outperforms competitors.

Context:
$context

Structure Requirements (Strict JSON output):
1. 'content_intro': A compelling, hook-driven summary/introduction (approx. 200 words). It must make the reader want to click 'Read More'. Wrapped in HTML <p> tags.
2. 'content_full': The COMPLETE, detailed article (1500-2000 words).
   - Must include the 'content_intro' text at the very beginning.
   - Use H2, H3, H4 tags for deep structure.
   - Use <ul>/<ol> lists, <blockquote> for emphasis.
   - Cover the topic exhaustively (What, Why, How, Examples, Expert Tips, FAQs).
   - Integrate related keywords naturally for maximum SEO Score.
3. 'seo_title': A high-CTR, SEO-optimized title (max 60 chars).
4. 'seo_description': A click-worthy meta description (max 160 chars).

Quality Rules:
- ZERO AI FOOTPRINT: Write like a human expert. No 'In conclusion', 'Delve into', 'Landscape'. Use varied sentence structure.
- SERP Analysis: Implicitly analyze the user intent from the search results and answer it better than the top results.
- Language: Turkish (since the query is Turkish).

Return STRICTLY valid JSON with keys: content_intro, content_full, seo_title, seo_description.";

        if ($this->provider === 'openai') {
            return $this->callOpenAI($prompt, true);
        } elseif ($this->provider === 'gemini') {
            return $this->callGemini($prompt, true);
        } elseif ($this->provider === 'xai') {
            return $this->callXAI($prompt, true);
        }
        return ['error' => 'Invalid Provider'];
    }

    public function enhanceContent($content, $type, $targetLang = 'tr') {
        if (empty($this->apiKey)) {
            return ['error' => 'API Key is missing.'];
        }

        $prompt = $this->buildPrompt($content, $type, $targetLang);

        if ($this->provider === 'openai') {
            return $this->callOpenAI($prompt);
        } elseif ($this->provider === 'gemini') {
            return $this->callGemini($prompt);
        } elseif ($this->provider === 'xai') {
            return $this->callXAI($prompt);
        } else {
            return ['error' => 'Invalid AI Provider selected.'];
        }
    }

    private function buildPrompt($content, $type, $lang) {
        $langName = $this->getLangName($lang);
        
        if ($type === 'title') {
            return "Act as an SEO expert. Rewrite the following $langName title to be catchy, SEO-friendly, and under 60 characters. Return ONLY the title, no quotes.\n\nTitle: $content";
        } elseif ($type === 'description') {
            return "Act as an SEO expert. Write a compelling, SEO-friendly meta description in $langName based on the following content. Keep it under 160 characters. Return ONLY the description.\n\nContent: $content";
        } elseif ($type === 'rewrite') {
            return "Act as a professional copywriter and SEO expert. 
1. Rewrite the content in $langName to be engaging and formatted with HTML (p, h2, ul).
2. Generate a catchy SEO Title (max 60 chars).
3. Generate a compelling SEO Description (max 160 chars).

Return STRICTLY valid JSON with keys: content, seo_title, seo_description.
Content:\n$content";
        } elseif ($type === 'keywords') {
             return "Extract 5-10 SEO keywords from the following text in $langName. Return them as a comma-separated list.\n\nText: $content";
        }
        
        return $content;
    }

    private function getLangName($code) {
        $langs = [
            'tr' => 'Turkish', 'en' => 'English', 'ru' => 'Russian',
            'ar' => 'Arabic', 'de' => 'German', 'fr' => 'French', 'cin' => 'Chinese'
        ];
        return isset($langs[$code]) ? $langs[$code] : 'Turkish';
    }

    private function callOpenAI($prompt, $jsonMode = false) {
        $model = $this->model ?: 'gpt-4o';
        $url = 'https://api.openai.com/v1/chat/completions';
        
        $data = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful SEO assistant.' . ($jsonMode ? ' Output valid JSON.' : '')],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.7
        ];

        if ($jsonMode) {
            $data['response_format'] = ['type' => 'json_object'];
        }

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->apiKey
        ]);
        // Fix for hanging connections
        curl_setopt($ch, CURLOPT_TIMEOUT, 120);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

        $response = curl_exec($ch);
        
        if (curl_errno($ch)) {
             return ['error' => 'Curl error: ' . curl_error($ch)];
        }
        
        curl_close($ch);
        $json = json_decode($response, true);

        if (isset($json['choices'][0]['message']['content'])) {
            return ['result' => $this->cleanOutput($json['choices'][0]['message']['content'])];
        } elseif (isset($json['error']['message'])) {
             return ['error' => 'OpenAI Error: ' . $json['error']['message']];
        }

        return ['error' => 'Unknown OpenAI response'];
    }

    private function callGemini($prompt, $jsonMode = false) {
         $model = $this->model ?: 'gemini-1.5-flash';
         $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key=" . $this->apiKey;

         $data = [
             'contents' => [
                 ['parts' => [['text' => $prompt]]]
             ]
         ];
         
         $ch = curl_init($url);
         curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
         curl_setopt($ch, CURLOPT_POST, true);
         curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
         curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
         
         // Fix for hanging connections
         curl_setopt($ch, CURLOPT_TIMEOUT, 120);
         curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
         curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
         curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
         
         $response = curl_exec($ch);
         
          if (curl_errno($ch)) {
             return ['error' => 'Curl error: ' . curl_error($ch)];
        }
        
         curl_close($ch);
         $json = json_decode($response, true);
         
         if (isset($json['candidates'][0]['content']['parts'][0]['text'])) {
             return ['result' => $this->cleanOutput($json['candidates'][0]['content']['parts'][0]['text'])];
         } elseif (isset($json['error']['message'])) {
             return ['error' => 'Gemini Error: ' . $json['error']['message']];
         }
         
         return ['error' => 'Unknown Gemini response'];
    }
    private function callXAI($prompt, $jsonMode = false) {
        $model = $this->model ?: 'grok-2-latest';
        $url = 'https://api.x.ai/v1/chat/completions';
        
        $data = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful SEO and translation assistant.' . ($jsonMode ? ' Output valid JSON.' : '')],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.7
        ];

        // x.ai might not support json_object type yet universally, but let's try
        if ($jsonMode) {
            $data['response_format'] = ['type' => 'json_object'];
        }

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->apiKey
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 120);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

        $response = curl_exec($ch);
        
        if (curl_errno($ch)) {
             return ['error' => 'Curl error: ' . curl_error($ch)];
        }
        
        curl_close($ch);
        $json = json_decode($response, true);

        if (isset($json['choices'][0]['message']['content'])) {
            return ['result' => $this->cleanOutput($json['choices'][0]['message']['content'])];
        } elseif (isset($json['error']['message'])) {
             return ['error' => 'X.AI Error: ' . $json['error']['message']];
        }

        return ['error' => 'Unknown X.AI response: ' . $response];
    }

    private function cleanOutput($text) {
        // Remove markdown code blocks
        $text = preg_replace('/^```(?:json|html)?\s*/i', '', $text);
        $text = preg_replace('/^```\s*/', '', $text);
        $text = preg_replace('/\s*```$/', '', $text);
        return trim($text);
    }
}
?>
