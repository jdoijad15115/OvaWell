// Enhanced multimedia video component for Qt movie integration
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

interface MultimediaVideoProps {
  videoTitle?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  onVideoEnd?: () => void;
}

export const MultimediaVideo: React.FC<MultimediaVideoProps> = ({ 
  videoTitle = "RepAIr Demo",
  showControls = true,
  autoPlay = false,
  onVideoEnd 
}) => {
  const [videoStatus, setVideoStatus] = useState<any>({});
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const videoRef = useRef<Video>(null);
  
  const { width } = Dimensions.get('window');
  const videoHeight = width * 0.5; // Reduced from 0.6 to show more of the video

  // Use your Qt movie file - try with explicit path
  const videoSource = require('../assets/videos/demovid.mov');

  const handlePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
          setIsPlaying(false);
          setShowPlayButton(true);
        } else {
          await videoRef.current.playAsync();
          setIsPlaying(true);
          setShowPlayButton(false);
        }
      } catch (error) {
        Alert.alert('Video Error', 'Could not control video playback');
      }
    }
  };

  const handleVideoLoad = (loadStatus: any) => {
    console.log('Video loaded successfully:', loadStatus);
    setVideoLoaded(true);
    setLoadingError(false);
    if (autoPlay) {
      handlePlayPause();
    }
  };

  const handleVideoError = (error: any) => {
    console.error('Video loading error:', error);
    setLoadingError(true);
    setVideoLoaded(false);
  };

  const handleLoadStart = () => {
    console.log('Video loading started...');
    setVideoLoaded(false);
    setLoadingError(false);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setVideoStatus(status);
    if ('isLoaded' in status && status.isLoaded) {
      if (status.didJustFinish && onVideoEnd) {
        onVideoEnd();
        setIsPlaying(false);
        setShowPlayButton(true);
      }
    }
  };

  return (
    <View style={{
      width: '100%',
      backgroundColor: '#1E1B4B',
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#6D28D9',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 15,
      borderWidth: 2,
      borderColor: '#7C3AED',
    }}>
      {/* Video Header */}
      <View style={{
        backgroundColor: 'rgba(124, 58, 237, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 18, marginRight: 8 }}>🎬</Text>
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          }}>
            {videoTitle}
          </Text>
        </View>
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
            Demo Video
          </Text>
        </View>
      </View>

      {/* Video Player Container */}
      <View style={{
        height: videoHeight,
        backgroundColor: '#000',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {(!videoLoaded && !loadingError) && (
          <View style={{
            position: 'absolute',
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 20,
            borderRadius: 12,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>📥</Text>
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
              marginTop: 8,
              textAlign: 'center',
            }}>
              Loading Demo Video...
            </Text>
            <Text style={{
              color: '#9CA3AF',
              fontSize: 14,
              marginTop: 4,
            }}>
              Preparing video player
            </Text>
          </View>
        )}

        {loadingError && (
          <View style={{
            position: 'absolute',
            zIndex: 10,
            backgroundColor: 'rgba(220, 38, 38, 0.9)',
            padding: 20,
            borderRadius: 12,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>⚠️</Text>
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
              marginTop: 8,
              textAlign: 'center',
            }}>
              Video Loading Failed
            </Text>
            <Text style={{
              color: '#FEE2E2',
              fontSize: 14,
              marginTop: 4,
              textAlign: 'center',
            }}>
              Please check video file
            </Text>
          </View>
        )}

        <Video
          ref={videoRef}
          source={videoSource}
          style={{
            width: '100%',
            height: '100%',
          }}
          useNativeControls={showControls}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          shouldPlay={false}
          volume={1.0}
          isMuted={false}
          onLoad={handleVideoLoad}
          onLoadStart={handleLoadStart}
          onError={handleVideoError}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          posterSource={require('../assets/images/circuit-bg.jpg')}
          usePoster={!videoLoaded}
          posterStyle={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
        />

        {/* Custom Play Button Overlay */}
        {showPlayButton && videoLoaded && (
          <TouchableOpacity
            onPress={handlePlayPause}
            style={{
              position: 'absolute',
              zIndex: 5,
              backgroundColor: 'rgba(124, 58, 237, 0.9)',
              borderRadius: 50,
              width: 80,
              height: 80,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <Text style={{ fontSize: 32, color: 'white' }}>▶️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Video Info Footer */}
      <View style={{
        backgroundColor: 'rgba(30, 27, 75, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>ℹ️</Text>
          <Text style={{
            color: '#E5E7EB',
            fontSize: 12,
          }}>
            Tap to play demonstration video
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: videoLoaded ? '#10B981' : '#F59E0B',
            marginRight: 6,
          }} />
          <Text style={{
            color: '#9CA3AF',
            fontSize: 12,
            fontWeight: '500',
          }}>
            {videoLoaded ? 'Ready' : 'Loading'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MultimediaVideo;
