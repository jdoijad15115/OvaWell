// Simple video component with better web compatibility
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export const SimpleVideo = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const { width } = Dimensions.get('window');

  // Use the video file for all platforms
  const videoSource = require('../assets/videos/demovid.mov');

  const handleVideoLoad = () => {
    console.log('✅ Video loaded successfully');
    setVideoLoaded(true);
    setLoadingError(false);
  };

  const handleVideoError = (error: any) => {
    console.error('❌ Video loading error:', error);
    setLoadingError(true);
    setVideoLoaded(false);
  };

  return (
    <View style={{
      width: '100%',
      backgroundColor: '#1E1B4B',
      borderRadius: 16,
      overflow: 'hidden',
      marginVertical: 16,
      borderWidth: 2,
      borderColor: '#7C3AED',
    }}>
      {/* Header */}
      <View style={{
        backgroundColor: 'rgba(124, 58, 237, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text style={{
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
        }}>
          🎬 RepAIr Demo Video
        </Text>
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
        }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
            {videoLoaded ? 'READY' : loadingError ? 'ERROR' : 'LOADING'}
          </Text>
        </View>
      </View>

      {/* Video Container */}
      <View style={{
        aspectRatio: 16/9,
        width: '100%',
        backgroundColor: '#000',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {loadingError ? (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 48, marginBottom: 10 }}>⚠️</Text>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Video Loading Error
            </Text>
            <Text style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
              Please refresh the page
            </Text>
          </View>
        ) : !videoLoaded ? (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🎬</Text>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Loading Demo Video...
            </Text>
            <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
              Preparing video player
            </Text>
          </View>
        ) : null}

        <Video
          source={videoSource}
          style={{
            width: '100%',
            height: '100%',
          }}
          useNativeControls={true}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          shouldPlay={false}
          onLoad={handleVideoLoad}
          onError={handleVideoError}
          onLoadStart={() => {
            setVideoLoaded(false);
            setLoadingError(false);
          }}
        />
      </View>

      {/* Footer */}
      <View style={{
        backgroundColor: 'rgba(30, 27, 75, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{ color: '#E5E7EB', fontSize: 12 }}>
          📱 Repair demonstration video
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: videoLoaded ? '#10B981' : loadingError ? '#EF4444' : '#F59E0B',
            marginRight: 4,
          }} />
          <Text style={{ color: '#9CA3AF', fontSize: 10 }}>
            {videoLoaded ? 'Ready' : loadingError ? 'Error' : 'Loading'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SimpleVideo;
