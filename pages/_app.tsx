import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react";
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraBaseProvider, ChakraProvider, extendBaseTheme } from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IKContext } from 'imagekitio-react';

const { Button } = chakraTheme.components

const theme = extendBaseTheme({
  components: {
    Button,
  },
})
console.log("imagekit url endpoint:", process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT)

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <IKContext urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}>
      <DndProvider backend={HTML5Backend}>
        <ChakraProvider theme={theme}>
          <SessionProvider session={pageProps.session}>
            <QueryClientProvider client={queryClient}>
              <Component {...pageProps} />
            </QueryClientProvider>
          </SessionProvider>
        </ChakraProvider>
      </DndProvider>
    </IKContext>
  );
}

export default App;