<?php
class SeoService {
    
    private $rules = [
        'titleLength' => ['min' => 40, 'max' => 60, 'weight' => 20],
        'descLength' => ['min' => 140, 'max' => 160, 'weight' => 20],
        'contentLength' => ['min' => 300, 'weight' => 30], // words
        'keywordDensity' => ['min' => 1, 'max' => 3, 'weight' => 20] // Not fully implemented in JS yet
    ];

    public function calculateScore($title, $seoTitle, $seoDesc, $content) {
        $score = 0;
        $details = [];

        // 1. Title Analysis
        // Use SEO Title if available, else standard Title
        $finalTitle = !empty($seoTitle) ? $seoTitle : $title;
        $titleLen = mb_strlen($finalTitle, 'UTF-8');

        if ($titleLen >= $this->rules['titleLength']['min'] && $titleLen <= $this->rules['titleLength']['max']) {
            $score += $this->rules['titleLength']['weight'];
            $details[] = "Title length ($titleLen) is optimal.";
        } else {
            // Partial score logic could go here, but JS is binary for now
             $details[] = "Title length ($titleLen) is outside optimal range (40-60).";
        }

        // 2. Description Analysis
        $descLen = mb_strlen($seoDesc, 'UTF-8');
        if ($descLen >= $this->rules['descLength']['min'] && $descLen <= $this->rules['descLength']['max']) {
            $score += $this->rules['descLength']['weight'];
            $details[] = "Description length ($descLen) is optimal.";
        } else {
            $details[] = "Description length ($descLen) is outside optimal range (140-160).";
        }

        // 3. Content Analysis
        // Strip HTML tags for word count
        $cleanContent = strip_tags($content);
        $wordCount = str_word_count($cleanContent);
        // For Turkish, str_word_count might not be perfect with utf8, but it's a good approximation.
        // Better to use explode space.
        $wordCount = count(preg_split('/\s+/', trim($cleanContent)));

        if ($wordCount >= $this->rules['contentLength']['min']) {
            $score += $this->rules['contentLength']['weight'];
             $details[] = "Content length ($wordCount words) is sufficient.";
        } else {
            // Scaled score
            $s = min($this->rules['contentLength']['weight'], ($wordCount / $this->rules['contentLength']['min']) * $this->rules['contentLength']['weight']);
            $score += $s;
            $details[] = "Content is too short ($wordCount words).";
        }

        // 4. Keyword/Other (Placeholder to match JS max 100 logic)
        // JS caps at 100. Currently we have 20+20+30 = 70 points max implemented above.
        // The JS has a 'keywordDensity' weight of 20, but doesn't implement it.
        // So the max score in JS right now is actually 70?
        // Let's check JS again. 
        // JS: score += rules.titleLength.weight (20)
        // JS: score += rules.descLength.weight (20)
        // JS: score += rules.contentLength.weight (30)
        // Total = 70.
        // Then: if (score > 100) score = 100;
        // So currently max score IS 70.
        // To be nice, let's normalize it to 100 or add a "Base Score" of 30?
        // No, let's match the JS exactly so user sees same numbers.
        
        return [
            'score' => floor($score),
            'details' => $details
        ];
    }
}
?>
