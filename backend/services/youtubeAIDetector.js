const axios = require('axios');

/**
 * YouTube AI Content Detector
 * Analyzes YouTube videos to determine if they're AI-generated
 */

class YouTubeAIDetector {
  constructor() {
    this.youtubeApiKey = process.env.YOUTUBE_API_KEY;
  }

  /**
   * Extract video ID from YouTube URL
   */
  extractVideoId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  /**
   * Fetch video details from YouTube API
   */
  async fetchVideoDetails(videoId) {
    if (!this.youtubeApiKey) {
      throw new Error('YouTube API key not configured');
    }

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics,contentDetails,status',
          id: videoId,
          key: this.youtubeApiKey
        }
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      return response.data.items[0];
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('YouTube API quota exceeded or invalid API key');
      }
      throw error;
    }
  }

  /**
   * Analyze text for AI-generated indicators
   */
  analyzeTextForAI(text) {
    if (!text) return { score: 0, indicators: [] };

    const aiIndicators = [
      // Common AI generation phrases
      { pattern: /\b(AI|artificial intelligence|machine learning|generated|created)\s+(by|using|with)\s+(AI|GPT|ChatGPT|Claude|Gemini|Midjourney|DALL-E|Stable Diffusion)/gi, weight: 30, label: 'Explicit AI mention' },
      { pattern: /\b(AI-generated|AI generated|AI-created|AI created|made with AI|created with AI)\b/gi, weight: 35, label: 'AI generation statement' },
      { pattern: /\b(text-to-video|text to video|AI video|AI animation)\b/gi, weight: 25, label: 'AI video generation' },
      { pattern: /\b(Synthesia|D-ID|HeyGen|Runway|Pictory|InVideo AI)\b/gi, weight: 40, label: 'AI video platform' },
      
      // Voice/narration indicators
      { pattern: /\b(AI voice|AI narration|text-to-speech|TTS|synthetic voice|voice clone|voice cloning)\b/gi, weight: 20, label: 'AI voice/narration' },
      { pattern: /\b(ElevenLabs|Murf|Descript|Resemble|Play\.ht)\b/gi, weight: 30, label: 'AI voice platform' },
      
      // Image/visual indicators
      { pattern: /\b(AI art|AI artwork|AI images|AI graphics|neural network|diffusion model)\b/gi, weight: 20, label: 'AI visual content' },
      { pattern: /\b(Midjourney|DALL-E|Stable Diffusion|Leonardo AI|Firefly)\b/gi, weight: 30, label: 'AI image platform' },
      
      // Generic AI tools
      { pattern: /\b(ChatGPT|GPT-4|GPT-3|Claude|Gemini|Bard|LLM|large language model)\b/gi, weight: 25, label: 'AI language model' },
      
      // Automation indicators
      { pattern: /\b(automated|auto-generated|automatically generated|bot-created)\b/gi, weight: 15, label: 'Automation mention' },
      
      // Disclaimer patterns
      { pattern: /\b(disclaimer|disclosure).*\b(AI|artificial intelligence)/gi, weight: 20, label: 'AI disclosure' },
      { pattern: /#AI|#AIgenerated|#AIart|#AIvideo/gi, weight: 15, label: 'AI hashtag' }
    ];

    let totalScore = 0;
    const foundIndicators = [];

    aiIndicators.forEach(indicator => {
      const matches = text.match(indicator.pattern);
      if (matches) {
        totalScore += indicator.weight;
        foundIndicators.push({
          label: indicator.label,
          matches: matches.length,
          examples: matches.slice(0, 3) // First 3 matches
        });
      }
    });

    return {
      score: Math.min(totalScore, 100),
      indicators: foundIndicators
    };
  }

  /**
   * Analyze channel for AI content patterns
   */
  analyzeChannelPatterns(channelTitle, channelDescription) {
    const aiChannelIndicators = [
      /\bAI\b/gi,
      /artificial intelligence/gi,
      /automated/gi,
      /bot/gi,
      /generated content/gi
    ];

    let score = 0;
    const text = `${channelTitle} ${channelDescription}`.toLowerCase();

    aiChannelIndicators.forEach(pattern => {
      if (pattern.test(text)) {
        score += 5;
      }
    });

    return Math.min(score, 20);
  }

  /**
   * Analyze video metadata patterns
   */
  analyzeMetadataPatterns(video) {
    const indicators = [];
    let suspicionScore = 0;

    // Check upload frequency (AI channels often upload very frequently)
    const publishedAt = new Date(video.snippet.publishedAt);
    const now = new Date();
    const daysSincePublish = (now - publishedAt) / (1000 * 60 * 60 * 24);

    // Check view-to-like ratio (AI content often has unusual engagement)
    const views = parseInt(video.statistics.viewCount) || 0;
    const likes = parseInt(video.statistics.likeCount) || 0;
    const comments = parseInt(video.statistics.commentCount) || 0;

    if (views > 0) {
      const likeRatio = (likes / views) * 100;
      const commentRatio = (comments / views) * 100;

      // Unusually low engagement might indicate AI content
      if (likeRatio < 0.5 && views > 1000) {
        suspicionScore += 10;
        indicators.push('Low engagement ratio');
      }

      if (commentRatio < 0.1 && views > 1000) {
        suspicionScore += 10;
        indicators.push('Very low comment ratio');
      }
    }

    // Check video duration patterns
    const duration = video.contentDetails.duration;
    const durationMatch = duration.match(/PT(\d+)M(\d+)S/);
    if (durationMatch) {
      const minutes = parseInt(durationMatch[1]) || 0;
      const seconds = parseInt(durationMatch[2]) || 0;
      const totalSeconds = minutes * 60 + seconds;

      // Very short videos (< 60s) or very specific durations might be AI
      if (totalSeconds < 60) {
        suspicionScore += 5;
        indicators.push('Very short duration');
      }
    }

    return { score: suspicionScore, indicators };
  }

  /**
   * Main detection method
   */
  async detectAIContent(url) {
    try {
      // Extract video ID
      const videoId = this.extractVideoId(url);
      if (!videoId) {
        return {
          success: false,
          error: 'Invalid YouTube URL or video ID'
        };
      }

      // Fetch video details
      const video = await this.fetchVideoDetails(videoId);

      // Analyze different aspects
      const titleAnalysis = this.analyzeTextForAI(video.snippet.title);
      const descriptionAnalysis = this.analyzeTextForAI(video.snippet.description);
      const tagsAnalysis = this.analyzeTextForAI(video.snippet.tags?.join(' ') || '');
      const channelScore = this.analyzeChannelPatterns(
        video.snippet.channelTitle,
        video.snippet.description
      );
      const metadataAnalysis = this.analyzeMetadataPatterns(video);

      // Calculate overall AI probability
      const weights = {
        title: 0.15,
        description: 0.40,
        tags: 0.15,
        channel: 0.10,
        metadata: 0.20
      };

      const overallScore = 
        (titleAnalysis.score * weights.title) +
        (descriptionAnalysis.score * weights.description) +
        (tagsAnalysis.score * weights.tags) +
        (channelScore * weights.channel) +
        (metadataAnalysis.score * weights.metadata);

      // Determine confidence level
      let confidence = 'low';
      let isAIGenerated = false;

      if (overallScore >= 60) {
        confidence = 'high';
        isAIGenerated = true;
      } else if (overallScore >= 35) {
        confidence = 'medium';
        isAIGenerated = true;
      } else if (overallScore >= 20) {
        confidence = 'low';
        isAIGenerated = true;
      }

      // Compile all indicators
      const allIndicators = [
        ...titleAnalysis.indicators.map(i => ({ ...i, source: 'title' })),
        ...descriptionAnalysis.indicators.map(i => ({ ...i, source: 'description' })),
        ...tagsAnalysis.indicators.map(i => ({ ...i, source: 'tags' })),
        ...metadataAnalysis.indicators.map(i => ({ label: i, source: 'metadata' }))
      ];

      return {
        success: true,
        videoId,
        videoTitle: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        isAIGenerated,
        confidence,
        aiProbability: Math.round(overallScore),
        analysis: {
          title: {
            score: Math.round(titleAnalysis.score),
            indicators: titleAnalysis.indicators
          },
          description: {
            score: Math.round(descriptionAnalysis.score),
            indicators: descriptionAnalysis.indicators
          },
          tags: {
            score: Math.round(tagsAnalysis.score),
            indicators: tagsAnalysis.indicators
          },
          channel: {
            score: Math.round(channelScore)
          },
          metadata: {
            score: Math.round(metadataAnalysis.score),
            indicators: metadataAnalysis.indicators
          }
        },
        indicators: allIndicators,
        statistics: {
          views: video.statistics.viewCount,
          likes: video.statistics.likeCount,
          comments: video.statistics.commentCount
        },
        thumbnail: video.snippet.thumbnails.high.url
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new YouTubeAIDetector();
