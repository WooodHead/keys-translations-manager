import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import container from './container/container'
import AppComponent from './views/App.server'
import configureStore from './store/configureStore'
const App = container(AppComponent)

global.navigator = global.navigator || {};

export default renderToString(
	<Provider store={configureStore()}>
		<App/>
	</Provider>
);
