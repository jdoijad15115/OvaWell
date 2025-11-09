// Video component for demo display
import React from 'react';
import { View, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

interface AppDemoVideoProps {
  onVideoLoad?: () => void;
}

export const AppDemoVideo: React.FC<AppDemoVideoProps> = ({ onVideoLoad }) => {
  const [videoStatus, setVideoStatus] = React.useState({});
  const [videoLoaded, setVideoLoaded] = React.useState(false);

  // Use your Qt movie demo video
  const videoSource = require('../assets/videos/demovid.mov');

  return (
    <View style={{
      height: 200, // Reduced from 250 to give more room for content
      backgroundColor: '#1E293B',
      borderRadius: 16,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#374151',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    }}>
      {!videoLoaded && (
        <View style={{ position: 'absolute', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.8)', padding: 16, borderRadius: 8 }}>
          <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>🎬 Loading Demo Video...</Text>
        </View>
      )}
      <Video 
        source={videoSource}
        style={{ 
          width: '100%', 
          height: 180  // Fixed height for better display
        }}
        useNativeControls={true}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        isLooping={false}
        onLoad={() => {
          setVideoLoaded(true);
          onVideoLoad?.();
        }}
        onPlaybackStatusUpdate={(status) => setVideoStatus(status)}
      />
    </View>
  );
};
