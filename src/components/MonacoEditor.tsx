import * as React from 'react';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

import { QuickBASIC } from '../extensions/quickbasic/languageConfiguration';

import {
  useResizeObserver,
  useUnmount,
  useMount,
} from '@ishikawa_masashi/react-hooks';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { IPosition } from 'monaco-editor';

type Editor = monaco.editor.IStandaloneCodeEditor;

// props の型を定義
type Props = {
  model: monaco.editor.ITextModel;
  onMouseDown?: (/*editor: Editor*/) => void;
  onDidChangeCursorPosition?: (e: IPosition) => void;
  onDidFocusEditorText?: () => void;
};

export type MonacoEditorRef = {
  setValue: (newValue: string) => void;
  getValue: () => string;
  setModelLanguage: (languageId: string) => void;
  setTheme: (newTheme: 'vs' | 'vs-dark' | 'hc-black') => void;
};

export function createModel(value = '') {
  return monaco.editor.createModel(value);
}

// コンポーネントを定義
const MonacoEditor = forwardRef<MonacoEditorRef, Props>((props, ref) => {
  const {
    model,
    onMouseDown = () => {},
    onDidChangeCursorPosition = (e: IPosition) => {},
    onDidFocusEditorText = () => {},
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const [width, height] = useResizeObserver(containerRef);

  const onMouseDownRef = useRef<(e: monaco.editor.IEditorMouseEvent) => void>(
    (e) => {
      /* no-op */
    }
  );

  const onDidChangeCursorPositionRef = useRef<(e: IPosition) => void>((e) => {
    /* no-op */
  });

  const onDidFocusEditorTextRef = useRef<() => void>(() => {
    /* no-op */
  });

  useEffect(() => {
    onMouseDownRef.current = (e) => {
      // const type = e.target.type;
      // if (
      //   type === MouseTargetType.GUTTER_LINE_NUMBERS ||
      //   type === MouseTargetType.GUTTER_GLYPH_MARGIN ||
      //   type === MouseTargetType.GUTTER_LINE_DECORATIONS
      // ) {
      //   onGutterMouseDown(e.target.position.lineNumber);
      // }
      if (editorRef.current) {
        onMouseDown(/*editorRef.current*/);
      }
    };
  }, [onMouseDown]);

  useEffect(() => {
    onDidChangeCursorPositionRef.current = (e) => {
      if (editorRef.current) {
        onDidChangeCursorPosition(e);
      }
    };
  }, [onDidChangeCursorPosition]);

  useEffect(() => {
    onDidFocusEditorTextRef.current = () => {
      if (editorRef.current) {
        onDidFocusEditorText();
      }
    };
  }, [onDidFocusEditorText]);

  const resize = () => {
    // console.log('resize!');
    if (
      editorRef.current &&
      containerRef.current &&
      editorContainerRef.current
    ) {
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

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setModel(model);
    }
  }, [model]);

  const createEditor = () => {
    if (!editorContainerRef.current) {
      return;
    }

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

    editorRef.current.setModel(model);

    editorRef.current.onMouseDown((e) => {
      onMouseDownRef.current(e);
    });

    editorRef.current.onDidChangeCursorPosition((e) => {
      onDidChangeCursorPositionRef.current(e.position);
    });

    editorRef.current.onDidChangeModelContent((e) => {
      if (e.isFlush) {
        return;
      }
    });

    editorRef.current.onDidFocusEditorText(() => {
      onDidFocusEditorTextRef.current();
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
    getValue() {
      if (editorRef.current) {
        return editorRef.current.getValue();
      }
      return '';
    },
    setModelLanguage(languageId: string) {
      monaco.editor.setModelLanguage(model, languageId);
    },
    setTheme(newTheme: 'vs' | 'vs-dark' | 'hc-black') {
      monaco.editor.setTheme(newTheme);
    },
  }));

  const containerStyle: React.CSSProperties = { width: '100%', height: '100%' };
  return (
    <div style={containerStyle} ref={containerRef}>
      <div ref={editorContainerRef}></div>
    </div>
  );
});

export default MonacoEditor;
