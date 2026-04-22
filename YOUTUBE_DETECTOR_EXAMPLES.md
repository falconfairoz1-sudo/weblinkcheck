# YouTube AI Detector - Detection Examples

## How Detection Works

The detector analyzes YouTube video metadata and assigns scores based on AI indicators found in different areas.

## Example 1: High Confidence AI Detection

### Input
```
URL: https://youtube.com/watch?v=example1
```

### Video Info
- **Title**: "I Created This Video Using AI - ChatGPT + Midjourney Tutorial"
- **Description**: "This entire video was AI-generated using ChatGPT for the script, Midjourney for images, and ElevenLabs for voice narration. Learn how I did it!"
- **Tags**: AI, ChatGPT, Midjourney, AI-generated, tutorial, AI art

### Detection Result
```
🤖 AI-Generated Content Detected
Confidence: HIGH
AI Probability: 85%

Analysis Breakdown:
├─ Title Analysis: 35%
│  └─ Found: "AI", "ChatGPT"
├─ Description Analysis: 95%
│  └─ Found: "AI-generated", "ChatGPT", "Midjourney", "ElevenLabs"
├─ Tags Analysis: 45%
│  └─ Found: "AI", "ChatGPT", "Midjourney", "AI-generated"
├─ Channel Patterns: 10%
└─ Metadata Patterns: 5%

Indicators Found:
✓ Explicit AI mention (description)
✓ AI generation statement (description)
✓ AI image platform (description, tags)
✓ AI voice platform (description)
✓ AI language model (title, description, tags)
```

---

## Example 2: Medium Confidence Detection

### Input
```
URL: https://youtube.com/watch?v=example2
```

### Video Info
- **Title**: "Top 10 Facts About Space"
- **Description**: "Interesting facts about space. Voice narration by text-to-speech. Images sourced from various AI art generators."
- **Tags**: space, facts, educational, science

### Detection Result
```
🤖 AI-Generated Content Detected
Confidence: MEDIUM
AI Probability: 42%

Analysis Breakdown:
├─ Title Analysis: 0%
├─ Description Analysis: 55%
│  └─ Found: "text-to-speech", "AI art generators"
├─ Tags Analysis: 0%
├─ Channel Patterns: 5%
└─ Metadata Patterns: 15%
   └─ Low engagement ratio detected

Indicators Found:
✓ AI voice/narration (description)
✓ AI visual content (description)
✓ Low engagement ratio (metadata)
```

---

## Example 3: Low Confidence / Unlikely AI

### Input
```
URL: https://youtube.com/watch?v=example3
```

### Video Info
- **Title**: "My Daily Vlog - Day 47"
- **Description**: "Hey everyone! Today I went to the park and met some friends. Hope you enjoy this vlog!"
- **Tags**: vlog, daily, lifestyle, friends

### Detection Result
```
👤 Likely Human-Created
Confidence: LOW
AI Probability: 8%

Analysis Breakdown:
├─ Title Analysis: 0%
├─ Description Analysis: 0%
├─ Tags Analysis: 0%
├─ Channel Patterns: 0%
└─ Metadata Patterns: 5%

Indicators Found:
(No AI indicators detected)

✅ No obvious AI indicators found in the video metadata
```

---

## Example 4: AI Tool Channel

### Input
```
URL: https://youtube.com/watch?v=example4
```

### Video Info
- **Title**: "New Feature Update - Version 2.0"
- **Description**: "Check out our latest features!"
- **Channel**: "Synthesia AI - AI Video Platform"
- **Tags**: update, features, video

### Detection Result
```
🤖 AI-Generated Content Detected
Confidence: HIGH
AI Probability: 65%

Analysis Breakdown:
├─ Title Analysis: 0%
├─ Description Analysis: 0%
├─ Tags Analysis: 0%
├─ Channel Patterns: 40%
│  └─ Channel name contains "AI" and "Synthesia"
└─ Metadata Patterns: 10%

Indicators Found:
✓ AI video platform (channel name)
✓ AI-focused channel (channel analysis)
```

---

## Example 5: Partial AI Disclosure

### Input
```
URL: https://youtube.com/watch?v=example5
```

### Video Info
- **Title**: "How to Code a Website in 2024"
- **Description**: "Complete tutorial on web development. Disclaimer: Some code examples were generated with ChatGPT assistance."
- **Tags**: coding, tutorial, web development, programming

### Detection Result
```
🤖 AI-Generated Content Detected
Confidence: MEDIUM
AI Probability: 38%

Analysis Breakdown:
├─ Title Analysis: 0%
├─ Description Analysis: 45%
│  └─ Found: "ChatGPT", "generated", "AI assistance"
├─ Tags Analysis: 0%
├─ Channel Patterns: 0%
└─ Metadata Patterns: 5%

Indicators Found:
✓ AI disclosure (description)
✓ AI language model (description)
✓ AI assistance mention (description)
```

---

## Detection Patterns Explained

### High Confidence (60%+)
- Multiple explicit AI tool mentions
- Clear AI generation statements
- AI platform names in title/description
- Channel focused on AI content

### Medium Confidence (35-59%)
- Some AI tool mentions
- Partial disclosure of AI use
- AI-related keywords present
- Unusual engagement patterns

### Low Confidence (20-34%)
- Minimal AI indicators
- Vague AI references
- Borderline patterns

### Unlikely AI (<20%)
- No AI indicators found
- Normal engagement patterns
- Human-created indicators present

---

## Keywords That Trigger Detection

### High Weight (30-40 points)
- "AI-generated", "AI generated"
- "AI-created", "AI created"
- "Synthesia", "D-ID", "HeyGen"
- "ElevenLabs", "Murf"
- "Midjourney", "DALL-E", "Stable Diffusion"

### Medium Weight (20-30 points)
- "ChatGPT", "GPT-4", "Claude", "Gemini"
- "AI voice", "AI narration"
- "text-to-speech", "TTS"
- "AI art", "AI images"
- "machine learning", "neural network"

### Low Weight (10-20 points)
- "AI", "artificial intelligence"
- "automated", "auto-generated"
- "bot-created"
- AI-related hashtags

---

## Metadata Patterns

### Engagement Analysis
```
Normal Video:
Views: 10,000
Likes: 500 (5% ratio) ✓
Comments: 100 (1% ratio) ✓

Suspicious Pattern:
Views: 10,000
Likes: 20 (0.2% ratio) ⚠️
Comments: 5 (0.05% ratio) ⚠️
```

### Duration Patterns
- Very short videos (<60s) may indicate AI
- Specific durations (exactly 1:00, 2:00) may indicate automation

### Upload Patterns
- Very frequent uploads (multiple per day)
- Consistent upload times (automated scheduling)

---

## Limitations

### Cannot Detect
❌ AI content without metadata disclosure
❌ Deepfakes or face swaps
❌ AI-edited videos (color grading, effects)
❌ AI-assisted but human-created content
❌ Subtle AI usage without mentions

### Can Detect
✅ Explicit AI tool mentions
✅ AI platform disclosures
✅ AI-focused channels
✅ Common AI generation patterns
✅ Unusual engagement metrics

---

## Best Practices

### For Content Creators
1. **Be transparent**: Mention AI tools used
2. **Add disclaimers**: State if content is AI-generated
3. **Tag appropriately**: Use #AI or #AIgenerated
4. **Describe process**: Explain how AI was used

### For Viewers
1. **Use as guidance**: Not 100% accurate
2. **Check multiple sources**: Don't rely solely on this tool
3. **Read descriptions**: Look for creator disclosures
4. **Consider context**: AI use isn't inherently bad

### For Researchers
1. **Collect data**: Track AI content trends
2. **Verify results**: Manual review recommended
3. **Note limitations**: Metadata-only analysis
4. **Respect privacy**: Only analyze public content

---

## Real-World Use Cases

### ✅ Good Uses
- Verify educational content authenticity
- Research AI content prevalence
- Identify undisclosed AI usage
- Study AI content trends
- Content moderation assistance

### ❌ Bad Uses
- Harass content creators
- Make definitive judgments
- Discriminate against AI content
- Violate creator privacy
- Spread misinformation

---

## Accuracy Expectations

| Confidence | Expected Accuracy | Recommendation |
|-----------|------------------|----------------|
| High (60%+) | 85-95% | Very likely AI |
| Medium (35-59%) | 60-80% | Possibly AI |
| Low (20-34%) | 40-60% | Uncertain |
| Unlikely (<20%) | 70-90% | Likely human |

**Note**: Accuracy depends on creator disclosure and metadata quality.

---

## Future Improvements

Planned enhancements:
- [ ] Video frame analysis (visual AI detection)
- [ ] Audio analysis (voice synthesis detection)
- [ ] Machine learning model training
- [ ] Historical pattern analysis
- [ ] Cross-video channel analysis
- [ ] Community feedback integration

---

**Remember**: This tool is for guidance only. Always respect content creators and their disclosures!
