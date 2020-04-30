import React from 'react';
import { useState, useEffect, useRef } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  useParams,
  useHistory,
  useLocation,
  Link,
} from 'react-router-dom';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Info from './Info';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuItem from '@material-ui/core/MenuItem';
import MonacoEditor, { MonacoEditorRef, createModel } from '../../src';
import Select from '@material-ui/core/Select';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SAMPLES from '../samples';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  toolbar: theme.mixins.toolbar,
}));

export default function Home() {
  const classes = useStyles();
  // const history = useHistory();
  const [value, setValue] = useState(0);
  const [modeId, setModeId] = useState('typescript');
  const [theme, setTheme] = useState<'vs' | 'vs-dark' | 'hc-black'>('vs');
  const modelRef = useRef(createModel());
  // const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
  //   setValue(newValue);

  //   history.push(pages[newValue]);
  // };
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setModeId(event.target.value as string);
  };

  const handleChangeTheme = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTheme(event.target.value as 'vs' | 'vs-dark' | 'hc-black');
  };

  const monacoEditorRef = useRef<MonacoEditorRef>();

  useEffect(() => {
    return () => {};
  });

  useEffect(() => {
    if (monacoEditorRef.current) {
      const monacoEditor = monacoEditorRef.current;
      monacoEditor.setValue(SAMPLES[modeId]);
      monacoEditor.setModelLanguage(modeId);
    }
  }, [monacoEditorRef.current]);

  useEffect(() => {
    if (monacoEditorRef.current) {
      const monacoEditor = monacoEditorRef.current;
      monacoEditor.setValue(SAMPLES[modeId]);
      monacoEditor.setModelLanguage(modeId);
    }
  }, [modeId]);

  useEffect(() => {
    if (monacoEditorRef.current) {
      const monacoEditor = monacoEditorRef.current;
      monacoEditor.setTheme(theme);
    }
  }, [theme]);

  const THEME = {
    'Visual Studio': 'vs',
    'Visual Studio Dark': 'vs-dark',
    'High Contrast Dark': 'hc-black',
  };
  // function changeTheme(theme) {
  //   var newTheme = theme === 1 ? 'vs-dark' : theme === 0 ? 'vs' : 'hc-black';
  //   monaco.editor.setTheme(newTheme);
  // }

  const menuItems = () => {
    const modesIds = monaco.languages.getLanguages().map((lang) => lang.id);
    modesIds.sort();

    return modesIds.map((modeId) => (
      <MenuItem value={modeId}>{modeId}</MenuItem>
    ));
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            React Monaco Editor
          </Typography>
          <div style={{ width: '64px' }}></div>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <FormControl className={classes.formControl}>
          <InputLabel id="mode-select-label">Language</InputLabel>
          <Select
            labelId="mode-select-label"
            id="mode-select"
            value={modeId}
            onChange={handleChange}
          >
            {menuItems()}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Theme</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={theme}
            onChange={handleChangeTheme}
          >
            <MenuItem value={'vs'}>Visual Studio</MenuItem>
            <MenuItem value={'vs-dark'}>Visual Studio Dark</MenuItem>
            <MenuItem value={'hc-black'}>High Contrast Dark</MenuItem>
          </Select>
        </FormControl>
        <div style={{ width: '100%', height: 'calc(100vh - 180px)' }}>
          <MonacoEditor ref={monacoEditorRef} model={modelRef.current} />
        </div>
      </main>
    </div>
  );
}
