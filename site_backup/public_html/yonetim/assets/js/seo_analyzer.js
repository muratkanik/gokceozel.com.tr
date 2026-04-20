/**
 * SEO Analyzer & AI Integration
 * Handles real-time SEO scoring and AI content generation.
 */

const SEOAnalyzer = {
    rules: {
        titleLength: { min: 40, max: 60, weight: 20 },
        descLength: { min: 140, max: 160, weight: 20 },
        contentLength: { min: 300, weight: 30 }, // words
        keywordDensity: { min: 1, max: 3, weight: 20 } // percentage
    },

    init: function () {
        this.bindEvents();
        this.initAI();
    },

    bindEvents: function () {
        const langs = ['tr', 'en', 'ru', 'ar', 'fr', 'de', 'cin'];

        langs.forEach(lang => {
            // Monitor inputs
            $(`input[name="${lang}baslik"], input[name="${lang}seotitle"], textarea[name="${lang}seodescription"]`).on('input', () => {
                this.analyze(lang);
            });

            // TinyMCE hook
            if (typeof tinymce !== 'undefined') {
                setTimeout(() => {
                    const editor = tinymce.get(`${lang}icerik`);
                    if (editor) {
                        editor.on('KeyUp Change', () => {
                            this.analyze(lang);
                        });
                    }
                }, 2000); // Wait for init
            }
        });
    },

    analyze: function (lang) {
        let score = 0;
        let checks = [];

        // Title Analysis
        const title = $(`input[name="${lang}baslik"]`).val() || '';
        const seoTitle = $(`input[name="${lang}seotitle"]`).val() || title;

        if (seoTitle.length >= this.rules.titleLength.min && seoTitle.length <= this.rules.titleLength.max) {
            score += this.rules.titleLength.weight;
            checks.push({ type: 'success', msg: 'Başlık uzunluğu iyi.' });
        } else {
            checks.push({ type: 'warning', msg: `Başlık ${seoTitle.length} karakter (Önerilen: 40-60).` });
        }

        // Description Analysis
        const seoDesc = $(`textarea[name="${lang}seodescription"]`).val() || '';
        if (seoDesc.length >= this.rules.descLength.min && seoDesc.length <= this.rules.descLength.max) {
            score += this.rules.descLength.weight;
            checks.push({ type: 'success', msg: 'Açıklama uzunluğu iyi.' });
        } else {
            checks.push({ type: 'warning', msg: `Açıklama ${seoDesc.length} karakter (Önerilen: 140-160).` });
        }

        // Content Analysis
        let content = '';
        if (typeof tinymce !== 'undefined' && tinymce.get(`${lang}icerik`)) {
            content = tinymce.get(`${lang}icerik`).getContent({ format: 'text' });
        }
        const wordCount = content.trim().split(/\s+/).length;

        if (wordCount >= this.rules.contentLength.min) {
            score += this.rules.contentLength.weight;
            checks.push({ type: 'success', msg: 'İçerik uzunluğu yeterli.' });
        } else {
            let s = Math.min(this.rules.contentLength.weight, (wordCount / this.rules.contentLength.min) * this.rules.contentLength.weight);
            score += s;
            checks.push({ type: 'warning', msg: `Kısa içerik (${wordCount} kelime).` });
        }

        // Final Score Adjustment
        score = Math.floor(score);
        if (score > 100) score = 100;

        // UI Update
        this.updateUI(lang, score, checks);
    },

    updateUI: function (lang, score, checks) {
        const bar = $(`#seo-progress-${lang}`);
        const badge = $(`#seo-score-${lang}`);
        const feedback = $(`#seo-feedback-${lang}`);

        if (bar.length === 0) return;

        // Color update
        let color = 'bg-danger';
        if (score > 40) color = 'bg-warning';
        if (score > 70) color = 'bg-success';

        bar.css('width', score + '%').removeClass('bg-danger bg-warning bg-success').addClass(color);
        badge.text(score + '/100').removeClass('bg-secondary bg-danger bg-warning bg-success').addClass(color.replace('bg-', 'bg-'));

        // Update Hidden Input for Saving
        $(`#seo-score-input-${lang}`).val(score);

        // Feedback
        let html = '<ul class="list-unstyled mb-0">';
        checks.forEach(c => {
            const icon = c.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-warning';
            html += `<li><i class="bi ${icon} me-1"></i> ${c.msg}</li>`;
        });
        html += '</ul>';
        feedback.html(html);
    },

    initAI: function () {
        // 1. Inject Hacker Terminal (Unified)
        if ($('#hacker-terminal').length === 0) {
            const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            $('body').append(`
                <div id="hacker-terminal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:99999; font-family:'Courier New', monospace; color:#0f0; padding:20px; overflow:hidden;">
                    <div style="max-width:900px; margin:50px auto; border: 1px solid #0f0; padding: 20px; background:#000; box-shadow: 0 0 20px #0f0; min-height:500px; position:relative;">
                        <div style="border-bottom:1px solid #0f0; padding-bottom:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:bold; letter-spacing:2px;">TERMINAL_SESSION_${dateCode}_ROOT</span>
                            <div style="display:flex; gap:10px; align-items:center;">
                                <span id="terminal-loader" style="display:none;">[PROCESSING]</span>
                                <button id="close-terminal-btn" style="background:#000; border:1px solid #0f0; color:#0f0; padding:5px 15px; cursor:pointer; font-family:inherit; font-weight:bold; display:none;">[ SHUTDOWN ]</button>
                            </div>
                        </div>
                        <div id="terminal-logs" style="height:380px; overflow-y:auto; font-size:14px; line-height:1.5;"></div>
                        <div class="progress mt-3" style="height: 5px; background: #333;">
                            <div id="terminal-progress-bar" class="progress-bar bg-success" role="progressbar" style="width: 0%; background-color:#0f0 !important;"></div>
                        </div>
                        <div class="blinking-cursor" style="margin-top:10px;">> <span id="typing-line"></span><span style="animation: blink 1s step-end infinite;">_</span></div>
                    </div>
                </div>
                <style>
                    @keyframes blink { 50% { opacity: 0; } }
                    #terminal-logs p { margin: 2px 0; opacity: 0.9; text-shadow: 0 0 2px rgba(0,255,0,0.5); }
                    .log-success { color: #0f0; }
                    .log-warning { color: #ff0; }
                    .log-error { color: #f00; font-weight:bold; }
                    .log-info { color: #0ff; }
                    #close-terminal-btn:hover { background: #0f0 !important; color: #000 !important; }
                </style>
            `);

            // Bind global close events
            $(document).on('click', '#close-terminal-btn', function () {
                $('#hacker-terminal').fadeOut();
            });

            // ESC key to close
            $(document).on('keydown', function (e) {
                if (e.key === "Escape" && $('#hacker-terminal').is(':visible')) {
                    if ($('#close-terminal-btn').is(':visible') || confirm("Process running. Abort?")) {
                        $('#hacker-terminal').fadeOut();
                    }
                }
            });
        }

        // 2. Inject Hacker Confirm Modal (if missing)
        if ($('#hacker-confirm').length === 0) {
            $('body').append(`
                <div id="hacker-confirm" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10001; font-family:'Courier New', monospace; color:#0f0;">
                    <div style="width:500px; margin:15% auto; border: 2px solid #f00; background:#000; box-shadow: 0 0 30px #f00; padding:20px; text-align:center;">
                        <h3 style="color:#f00; border-bottom:1px solid #f00; padding-bottom:10px;">⚠️ WARNING: DATA OVERWRITE</h3>
                        <p style="font-size:16px; margin:20px 0;">DETECTED EXISTING CONTENT.</p>
                        <p style="margin-bottom:20px;">INITIATING "RESEARCH & WRITE" PROTOCOL WILL <span style="color:#f00;">ERASE</span> CURRENT DATA.</p>
                        <p>PROCEED?</p>
                        <div style="display:flex; justify-content:center; gap:20px; margin-top:30px;">
                            <button id="hacker-confirm-yes" class="btn btn-outline-danger btn-lg" style="border:1px solid #f00; color:#f00; background:#000;">[ Y ] EXECUTE</button>
                            <button id="hacker-confirm-no" class="btn btn-outline-success btn-lg" style="border:1px solid #0f0; color:#0f0; background:#000;">[ N ] ABORT</button>
                        </div>
                    </div>
                </div>
            `);
        }

        const log = (msg, type = 'normal') => {
            const colors = { 'normal': '#0f0', 'success': '#0f0', 'warning': '#ff0', 'error': '#f00', 'info': '#0ff' };
            const timestamp = new Date().toLocaleTimeString('tr-TR');
            const p = $(`<p style="color:${colors[type]}"><span style="opacity:0.5">[${timestamp}]</span> ${msg}</p>`);
            $('#terminal-logs').append(p);
            // Auto scroll
            const div = document.getElementById('terminal-logs');
            if (div) div.scrollTop = div.scrollHeight;
        };

        const typeWriter = (text, callback) => {
            let i = 0;
            const speed = 10;
            $('#typing-line').text('');
            function type() {
                if (i < text.length) {
                    document.getElementById('typing-line').innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    $('#typing-line').text('');
                    log(text);
                    if (callback) callback();
                }
            }
            type();
        };

        // TRANSLATE BUTTON HANDLER
        $(document).on('click', '.ai-translate-btn', function (e) {
            e.preventDefault();

            // Hacker Check & Injection
            if ($('#hacker-terminal').length === 0) {
                const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
                $('body').append(`
                <div id="hacker-terminal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:99999; font-family:'Courier New', monospace; color:#0f0; padding:20px; overflow:hidden;">
                    <div style="max-width:900px; margin:50px auto; border: 1px solid #0f0; padding: 20px; background:#000; box-shadow: 0 0 20px #0f0; min-height:500px; position:relative;">
                        <div style="border-bottom:1px solid #0f0; padding-bottom:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:bold; letter-spacing:2px;">TERMINAL_SESSION_${dateCode}_ROOT</span>
                            <button id="close-terminal-btn" style="background:#000; border:1px solid #0f0; color:#0f0; padding:5px 15px; cursor:pointer; font-family:inherit; font-weight:bold; display:none; hover:background:#0f0; hover:color:#000;">[ SHUTDOWN ]</button>
                        </div>
                        <div id="terminal-logs" style="height:380px; overflow-y:auto; font-size:14px; line-height:1.5;"></div>
                        <div class="progress mt-3" style="height: 5px; background: #333;">
                            <div id="terminal-progress-bar" class="progress-bar bg-success" role="progressbar" style="width: 0%; background-color:#0f0 !important;"></div>
                        </div>
                        <div class="blinking-cursor" style="margin-top:10px;">> <span id="typing-line"></span><span style="animation: blink 1s step-end infinite;">_</span></div>
                    </div>
                </div>
                <style>
                    @keyframes blink { 50% { opacity: 0; } }
                    #terminal-logs p { margin: 2px 0; opacity: 0.9; text-shadow: 0 0 2px rgba(0,255,0,0.5); }
                    .log-success { color: #0f0; }
                    .log-warning { color: #ff0; }
                    .log-error { color: #f00; font-weight:bold; }
                    .log-info { color: #0ff; }
                    #close-terminal-btn:hover { background: #0f0 !important; color: #000 !important; }
                </style>
                `);

                // Bind close event immediately
                $(document).on('click', '#close-terminal-btn', function () {
                    $('#hacker-terminal').fadeOut();
                });
            }

            // Gather TR Data
            const trData = {
                title: $('input[name="trbaslik"]').val(),
                content: tinymce.get('tricerik').getContent(),
                detail: tinymce.get('trdetay').getContent(),
                seo_title: $('input[name="trseotitle"]').val(),
                seo_description: $('textarea[name="trseodescription"]').val()
            };

            if (!trData.title || !trData.content) {
                alert("Lütfen önce Türkçe içeriği doldurun.");
                return;
            }

            // Init Terminal
            $('#terminal-logs').empty();
            $('#hacker-terminal').fadeIn(200);
            $('#close-terminal-btn').hide();
            $('#terminal-progress-bar').css('width', '0%');

            log('INITIALIZING UNIVERSAL TRANSLATOR SEQUENCE...', 'info');

            setTimeout(() => {
                log('Source Language: TURKISH', 'normal');
                const targets = ['en', 'ru', 'ar', 'fr', 'de', 'cin'];
                log('Target Languages: ' + targets.join(', ').toUpperCase(), 'normal');

                log('Analyzing semantic structure...', 'warning');

                // Sequential Processing Recursive Function
                let currentIndex = 0;

                function processNextLanguage() {
                    if (currentIndex >= targets.length) {
                        // All done
                        log('ALL TRANSLATIONS COMPLETE.', 'success');
                        log('SYSTEM READY.', 'success');
                        $('#close-terminal-btn').css('display', 'inline-block');
                        $('#terminal-progress-bar').removeClass('progress-bar-striped active').css('background-color', '#0f0');
                        return;
                    }

                    const lang = targets[currentIndex];
                    const langName = lang.toUpperCase();

                    log(`Translating to [${langName}]...`, 'warning');
                    $('#terminal-progress-bar').addClass('progress-bar-striped active');

                    $.ajax({
                        url: 'ajax/ai_enhance.php',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            type: 'translate_single',
                            target_lang: lang,
                            data: trData
                        }),
                        dataType: 'json',
                        timeout: 60000, // 60s per language
                        success: function (res) {
                            // Parse string response if needed
                            if (typeof res === 'string') {
                                try { res = JSON.parse(res); } catch (e) { }
                            }
                            // Unpack 'result' if present (AI Service wrapper)
                            if (res.result && typeof res.result === 'string') {
                                try {
                                    const payload = JSON.parse(res.result);
                                    Object.assign(res, payload);
                                } catch (e) { console.error("Parse error", e); }
                            }

                            if (res.status === 'success' || (res.title && res.content)) {
                                log(`[${langName}] Translation Successful.`, 'success');

                                // Update form fields
                                // Handle inconsistencies in field names if any
                                let prefix = lang;

                                $(`input[name="${prefix}baslik"]`).val(res.title);
                                if (tinymce.get(`${prefix}icerik`)) tinymce.get(`${prefix}icerik`).setContent(res.content);
                                if (tinymce.get(`${prefix}detay`)) tinymce.get(`${prefix}detay`).setContent(res.detail || '');
                                $(`input[name="${prefix}seotitle"]`).val(res.seo_title);
                                $(`textarea[name="${prefix}seodescription"]`).val(res.seo_description);

                                // Update progress bar
                                const percent = ((currentIndex + 1) / targets.length) * 100;
                                $('#terminal-progress-bar').css('width', percent + '%');

                                currentIndex++;
                                setTimeout(processNextLanguage, 500); // Small delay
                            } else {
                                log(`[${langName}] FAILED: ` + (res.message || res.error || 'Unknown Error'), 'error');
                                currentIndex++;
                                setTimeout(processNextLanguage, 500);
                            }
                        },
                        error: function (xhr, status, error) {
                            log(`[${langName}] NETWORK ERROR: ` + error, 'error');
                            currentIndex++;
                            setTimeout(processNextLanguage, 500);
                        }
                    });
                }

                // Start
                setTimeout(processNextLanguage, 1000);

            }, 1000);
        });

        // EXISTING AI BUTTON HANDLER (Updated for JSON)
        $(document).on('click', '.ai-enhance-btn', function (e) {
            e.preventDefault();
            const btn = $(this);
            const type = btn.data('type');
            const lang = btn.data('lang');

            // Context Validation
            let contentContext = '';
            if (type === 'title') {
                contentContext = $(`input[name="${lang}baslik"]`).val();
                if (!contentContext) { alert("Lütfen önce bir içerik girin."); return; }
            } else if (type === 'description') {
                contentContext = $(`input[name="${lang}baslik"]`).val() + "\n" + tinymce.get(`${lang}icerik`).getContent({ format: 'text' });
                if (!contentContext) { alert("Lütfen önce başlık veya içerik girin."); return; }
            } else if (type === 'rewrite') {
                contentContext = tinymce.get(`${lang}icerik`).getContent();
                if (!contentContext) { alert("Lütfen önce içerik girin."); return; }
            }

            // Open Terminal
            $('#terminal-logs').empty();
            $('#hacker-terminal').fadeIn(200);
            $('#terminal-loader').show();

            const taskName = type === 'title' ? 'GENERATE_TITLE' : (type === 'description' ? 'GENERATE_META_DESC' : 'REWRITE_CONTENT_SEO');

            // Sequence of fake logs
            typeWriter(`Initializing AI Sequence [${taskName}]...`, () => {
                log(`Target Language: ${lang.toUpperCase()}`, 'info');
                log(`Analyzing input context (${contentContext.length} bytes)...`);

                setTimeout(() => {
                    log(`Establishing secure connection to Neural API...`, 'warning');

                    // AJAX Call
                    $.ajax({
                        url: 'ajax/ai_enhance.php',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({ type: type, lang: lang, content: contentContext }),
                        success: function (res) {
                            // JSON Check
                            if (typeof res === 'string') {
                                log(`RAW RESPONSE: ${res.substring(0, 50)}...`, 'warning');
                                try { res = JSON.parse(res); } catch (e) { log(`CRITICAL: Invalid JSON`, 'error'); return; }
                            }

                            if (res.error) {
                                log(`CRITICAL ERROR: ${res.error}`, 'error');
                                $('#terminal-loader').hide();
                                setTimeout(() => $('#hacker-terminal').fadeOut(), 5000);
                            } else if (res.result) {
                                log(`Response received. Decoding payload...`, 'success');
                                setTimeout(() => {
                                    log(`Optimizing output vectors...`);

                                    // Handle Complex Object (Rewrite with SEO)
                                    if (type === 'rewrite') {
                                        let parsed = res.result;

                                        // Case 1: result is already an object (ideal)
                                        if (typeof parsed === 'object' && parsed !== null) {
                                            // proceed
                                        }
                                        // Case 2: result is a string (common)
                                        else if (typeof parsed === 'string') {
                                            // Strict JSON Extraction: Find first '{' and last '}'
                                            const firstOpen = parsed.indexOf('{');
                                            const lastClose = parsed.lastIndexOf('}');

                                            if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
                                                let jsonCandidate = parsed.substring(firstOpen, lastClose + 1);
                                                try {
                                                    parsed = JSON.parse(jsonCandidate);
                                                } catch (e) {
                                                    log(`CRITICAL: JSON Parsing Failed despite extraction.`, 'error');
                                                    // Fallback: maybe it's just content?
                                                    parsed = { content: parsed };
                                                }
                                            } else {
                                                // No JSON object found, treat as plain text content
                                                parsed = { content: parsed };
                                            }
                                        }

                                        if (parsed && (parsed.content || parsed.seo_title)) {
                                            // Update Content
                                            if (parsed.content) {
                                                tinymce.get(`${lang}icerik`).setContent(parsed.content);
                                                log(`Content Updated.`);
                                            }

                                            // Update SEO
                                            if (parsed.seo_title) {
                                                $(`input[name="${lang}seotitle"]`).val(parsed.seo_title);
                                                log(`SEO Title Generated: ${parsed.seo_title.substring(0, 20)}...`);
                                            }
                                            if (parsed.seo_description) {
                                                $(`textarea[name="${lang}seodescription"]`).val(parsed.seo_description);
                                                log(`SEO Description Generated.`);
                                            }
                                        } else {
                                            // Fallback for simple string if object logic failed totally
                                            tinymce.get(`${lang}icerik`).setContent(res.result);
                                        }
                                    } else if (type === 'title') {
                                        $(`input[name="${lang}seotitle"]`).val(res.result).trigger('input');
                                        if (!$(`input[name="${lang}baslik"]`).val()) $(`input[name="${lang}baslik"]`).val(res.result);
                                    } else if (type === 'description') {
                                        $(`textarea[name="${lang}seodescription"]`).val(res.result).trigger('input');
                                    }

                                    log(`Operation Successful. Updating UI...`, 'success');
                                    typeWriter(`Closing session...`, () => {
                                        setTimeout(() => {
                                            $('#hacker-terminal').fadeOut();
                                            $('#terminal-loader').hide();
                                        }, 800);
                                    });
                                }, 800);
                            }
                        },
                        error: function (xhr, status, error) {
                            log(`CONNECTION FAILED: ${status.toUpperCase()} - ${error}`, 'error');
                            log(`Info: ${xhr.responseText.substring(0, 50)}...`, 'info');
                            $('#terminal-loader').hide();
                            setTimeout(() => $('#hacker-terminal').fadeOut(), 5000);
                        }
                    });
                }, 600);
            });
        });

        // SEARCH & WRITE BUTTON HANDLER (ENHANCED HACKER UI)
        $(document).on('click', '.ai-research-btn', function (e) {
            e.preventDefault();
            e.stopPropagation(); // Stop bubbling
            console.log("Research button clicked");

            const title = $('input[name="trbaslik"]').val();
            if (!title) {
                alert("Lütfen önce bir Başlık girin.");
                return;
            }

            // Define the Execution Logic
            const executeResearch = () => {
                $('#hacker-confirm').fadeOut();

                // Open Terminal
                $('#terminal-logs').empty();
                $('#hacker-terminal').fadeIn(200);
                $('#terminal-loader').show();

                // Helper for delay
                const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                (async () => {
                    log(`_ SYSTEM INITIALIZED...`, 'success');
                    await wait(600);
                    log(`Target Query: "${title}"`);
                    await wait(800);
                    log(`Establishing secure connection to Serper.dev API...`, 'warning');

                    // Simulate matrix effect
                    const matrixInterval = setInterval(() => {
                        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
                        let rand = "";
                        for (let i = 0; i < 40; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length));
                        $('#terminal-loader').text(rand);
                    }, 50);

                    await wait(1500);
                    log(`Connection ESTABLISHED.`, 'success');
                    await wait(500);
                    log(`> Executing Search Protocol...`, 'info');

                    $.ajax({
                        url: 'ajax/ai_enhance.php',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({ type: 'research_write', content: title }),
                        success: async function (res) {
                            clearInterval(matrixInterval);
                            $('#terminal-loader').text('PROCESSING DATA...');

                            log(`> Search Complete. 20 Results Found.`, 'success');
                            await wait(600);

                            // Simulate analyzing each result
                            for (let i = 1; i <= 5; i++) {
                                log(`Scanning Result [${i}/20]: Extracting semantic vectors...`, 'warning');
                                await wait(150 + Math.random() * 200);
                            }
                            log(`Scanning Result [20/20]: Done.`, 'success');
                            await wait(500);

                            log(`> Synthesizing Unique Content Model...`, 'info');
                            await wait(1500);

                            // Parse response logic
                            if (typeof res === 'string') {
                                try { res = JSON.parse(res); } catch (e) { }
                            }
                            if (res.result && typeof res.result === 'string') {
                                let clean = res.result.replace(/```json/gi, '').replace(/```/g, '').trim();
                                const firstOpen = clean.indexOf('{');
                                const lastClose = clean.lastIndexOf('}');
                                if (firstOpen !== -1 && lastClose !== -1) clean = clean.substring(firstOpen, lastClose + 1);
                                try { Object.assign(res, JSON.parse(clean)); } catch (e) { }
                            }

                            if (res.error) {
                                log(`CRITICAL ERROR: ${res.error}`, 'error');
                                setTimeout(() => $('#hacker-terminal').fadeOut(), 5000);
                            } else {
                                log(`Content Generated Successfully.`, 'success');
                                log(`> Writing to database...`, 'info');
                                await wait(800);

                                if (res.content_intro) {
                                    tinymce.get('tricerik').setContent(res.content_intro);
                                    log(`Intro Updated.`, 'success');
                                }
                                if (res.content_full) {
                                    tinymce.get('trdetay').setContent(res.content_full);
                                    log(`Detail Updated.`, 'success');
                                }
                                if (res.seo_title) $('input[name="trseotitle"]').val(res.seo_title);
                                if (res.seo_description) $('textarea[name="trseodescription"]').val(res.seo_description);

                                log(`_ OPERATION COMPLETED.`, 'success');
                                log(`Terminating Session...`);
                                await wait(1500);
                                $('#hacker-terminal').fadeOut();
                            }
                        },
                        error: function (xhr, status, error) {
                            clearInterval(matrixInterval);
                            log(`CONNECTION LOST: ${error}`, 'error');
                            setTimeout(() => $('#hacker-terminal').fadeOut(), 5000);
                        }
                    });

                })();
            };

            // Check if content exists (CONFIRMATION LOGIC)
            const currentContent = tinymce.get('tricerik').getContent();
            const currentDetail = tinymce.get('trdetay').getContent();
            console.log("Content lengths:", currentContent.length, currentDetail.length);

            if (currentContent.length > 50 || currentDetail.length > 50) {
                console.log("Showing Hacker Confirm Modal");
                // Show Hacker Confirm Modal
                $('#hacker-confirm').fadeIn(200);

                // One-time event binding to prevent stacking
                $('#hacker-confirm-yes').off('click').on('click', function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    console.log("CONFIRM: YES clicked");
                    executeResearch();
                });

                $('#hacker-confirm-no').off('click').on('click', function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    console.log("CONFIRM: NO clicked");
                    $('#hacker-confirm').fadeOut();
                });
            } else {
                // No content, proceed directly
                console.log("No content detected, proceeding directly");
                executeResearch();
            }
        });

    }
};

$(document).ready(function () {
    SEOAnalyzer.init();
});
