/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
} from 'react-native';

import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';

type FILE_EXTENSIONS = 'jpg' | 'pdf' | 'ppt' | 'doc';

function App(): JSX.Element {

  const html = `
      <html>
      <head></head>
      <body>
        <script>
          function magica(msg){
            window.ReactNativeWebView.postMessage(msg)
          }
        </script>
        <div style="margin-top:200px;">
        <a href="javascript:void(0)" onClick="magica('jpg')" style="width:100%;font-size:3rem; ">Magically Open an image</a>
        <br />
        <br />
        <a href="javascript:void(0)" onClick="magica('pdf')" style="width:100%;font-size:3rem; ">Magically Open a pdf</a>
        <br />
        <br />
        <a href="javascript:void(0)" onClick="magica('ppt')" style="width:100%;font-size:3rem; ">Magically Open a ppt</a>
        <br />
        <br />
        <a href="javascript:void(0)" onClick="magica('doc')" style="width:100%;font-size:3rem; ">Magically Open a doc</a>
        </div>
      </body>
      </html>
    `;

  const createMagica = async (msg:FILE_EXTENSIONS) => {
    console.log('msg', msg);
    let downloadableFiles: Record<FILE_EXTENSIONS, string> = {
      jpg: 'https://sample-videos.com/img/Sample-jpg-image-50kb.jpg',
      pdf: 'https://assets.ctfassets.net/l3l0sjr15nav/29D2yYGKlHNm0fB2YM1uW4/8e638080a0603252b1a50f35ae8762fd/Get_Started_With_Smallpdf.pdf',
      ppt: 'https://sample-videos.com/ppt/Sample-PPT-File-500kb.ppt',
      doc: 'https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Ffile-examples.com%2Fstorage%2Ffefb234bc0648a3e7a1a47d%2F2017%2F02%2Ffile-sample_100kB.doc&wdOrigin=BROWSELINK',
    };

    const download = RNFS.downloadFile({fromUrl: downloadableFiles[msg],
      toFile: `${RNFS.DocumentDirectoryPath}/sample.${msg}`});

      await download.promise
      .then(() => {
        const path = `${RNFS.DocumentDirectoryPath}/sample.${msg}`;
        console.log('path', path);
        console.log(RNFS.exists(path));

        FileViewer.open(path, {showOpenWithDialog: true})
        .then(() => {
        })
        .catch((error) => {
          // error
          console.log('open error',error);
        });
      })
      .catch((err) => {
        console.log('download error', err);
      });
  };


  return (
    <View style={{ flex: 1 }}>
        <WebView
          source={{ html }}
          onMessage={(event) =>
            createMagica(event.nativeEvent.data as FILE_EXTENSIONS)
          }
        />

    </View>
  );
}

export default App;
