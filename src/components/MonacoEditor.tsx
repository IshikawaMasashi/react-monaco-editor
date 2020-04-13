import * as React from 'react';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { QuickBASIC } from '../extensions/quickbasic/languageConfiguration';
import {
  useResizeObserver,
  useUnmount,
  useMount,
} from '@ishikawa_masashi/react-hooks';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// スタイルを定義
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(6),
    },
    title: {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
    paper: {
      padding: 18,
    },
    button: {
      margin: theme.spacing(1),
    },
    container: { width: '100%', height: '100%' },
  })
);

// props の型を定義
type Props = {
  // value?: string;
  // language?: string;
};

export type MonacoEditorRef = {
  setValue: (newValue: string) => void;
  setModelLanguage: (languageId: string) => void;
  setTheme: (newTheme: 'vs' | 'vs-dark' | 'hc-black') => void;
};
// コンポーネントを定義
// export default function Monaco(props: Props) {
const MonacoEditor = forwardRef<MonacoEditorRef, Props>((props, ref) => {
  // const { value = '', language = '' } = props;

  // const model = monaco.editor.createModel(value);

  // ここでクラス名を取得
  const classes = useStyles({});

  const modelRef = useRef<monaco.editor.ITextModel>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const [width, height] = useResizeObserver(containerRef);

  const resize = () => {
    // console.log('resize!');
    if (editorRef.current && containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;

      const width = clientWidth + 'px';
      const height = clientHeight + 'px';
      // console.log(`${width}:${height}`);

      if (
        editorContainerRef.current.style.width !== width ||
        editorContainerRef.current.style.height !== height
      ) {
        editorContainerRef.current.style.width = width;
        editorContainerRef.current.style.height = height;
        editorRef.current.layout();
      }
    }
  };

  useEffect(() => {
    if (width && height) {
      resize();
    }
  }, [width, height]);

  // useEffect(() => {
  //   if (modelRef.current) {
  //     monaco.editor.setModelLanguage(modelRef.current, language);
  //   }
  // }, [language]);

  // useEffect(() => {
  //   if (modelRef.current) {
  //     modelRef.current.setValue(value);
  //   }
  // }, [value]);

  const createEditor = () => {
    if (!editorContainerRef.current) {
      return;
    }

    // modelRef.current = monaco.editor.createModel(value);
    // monaco.editor.setModelLanguage(modelRef.current, language);

    modelRef.current = monaco.editor.createModel('');

    // const options = Object.assign(
    //   {
    //     theme: "vs-dark",
    //     minimap: {
    //       enabled: false
    //     },
    //     fontWeight: "bold",
    //     renderLineHighlight: "none",
    //     language: "quickbasic"
    //   },
    //   {}
    // );
    // if (editorContainerRef.current.lastChild) {
    //   editorContainerRef.current.removeChild(
    //     editorContainerRef.current.lastChild
    //   );
    // }

    editorRef.current = monaco.editor.create(editorContainerRef.current, {
      theme: 'vs-dark',
      minimap: {
        enabled: false,
      },
      fontWeight: 'bold',
      renderLineHighlight: 'none',
      language: 'quickbasic',
      // automaticLayout: true,
    });

    editorRef.current.setModel(modelRef.current);

    editorRef.current.onDidChangeModelContent((e) => {
      if (e.isFlush) {
        return;
      }
    });

    // editorRef.current.onKeyUp((e) => {});
  };

  useMount(() => {
    // QuickBASIC
    monaco.languages.register({
      id: 'quickbasic',
    });
    monaco.languages.setMonarchTokensProvider(
      'quickbasic',
      QuickBASIC.MonarchDefinitions
    );

    createEditor();
  });

  useUnmount(() => {
    if (editorRef.current) {
      editorRef.current.dispose();
    }
  });

  // コンポーネントのインスタンスが持つメソッドを宣言
  useImperativeHandle(ref, () => ({
    setValue(newValue: string) {
      if (editorRef.current) {
        editorRef.current.setValue(newValue);
      }
    },
    setModelLanguage(languageId: string) {
      monaco.editor.setModelLanguage(modelRef.current, languageId);
    },
    setTheme(newTheme: 'vs' | 'vs-dark' | 'hc-black') {
      monaco.editor.setTheme(newTheme);
    },
  }));

  return (
    <div className={classes.container} ref={containerRef}>
      <div ref={editorContainerRef}></div>
    </div>
  );
});

export default MonacoEditor;
