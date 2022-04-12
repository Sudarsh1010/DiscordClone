import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Text} from 'react-native'

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { StreamChat } from 'stream-chat' 
import {
  OverlayProvider,
  Chat,
  ChannelList,
  Channel,
  MessageList,
  MessageInput
} from 'stream-chat-expo'
import { useEffect, useState } from 'react';

const API_KEY = 'mw247h6u2phv';
const client = StreamChat.getInstance(API_KEY);

export default function App() {
  const isLoadingComplete = useCachedResources();
  // const colorScheme = useColorScheme();

  const [isReady, setIsReady] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const connectUser = async () => {
    await client.connectUser(
      {
        id: 'Sudarsh',
        name: 'Sudharsan Jain',

      },
      client.devToken('Sudarsh')
    )

    const channel = client.channel(
      'team',
      'general',
      { name: 'General', }
    );

    await channel.create();

    // setSelectedChannel(channel)
    setIsReady(true)
  }
  
  useEffect(() => {
      connectUser()
  }, [])
  
  const onChannelSelect = (channel) => {
    console.log(channel)
    setSelectedChannel(channel)
  }

  if (!isLoadingComplete || !isReady) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <OverlayProvider>
          <Chat client={client}>
            {/* <Navigation ColorScheme={ColorSchemes} /> */}
            {!selectedChannel
              ? (
                <ChannelList  onSelect={onChannelSelect} />
              ) : (
                <>
                  <Channel channel={selectedChannel}>
                    <Text style={{ marginVertical: 30, marginHorizontal: 20}}
                      // onPress={() => setSelectedChannel(null)}
                    >
                      GO BACK!
                    </Text>
                    <MessageList/>
                    <MessageInput/>
                  </Channel>                  
                </>
              )
            }
          </Chat>
        </OverlayProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
