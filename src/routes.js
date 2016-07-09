import React from 'react'
import { Route, IndexRoute } from 'react-router'
import TablePanel from './components/grid/TablePanel'
import container from './container/container'
import AppComponent from './App'
const App = container(AppComponent)
const NoMatch = () => <div><h1>404</h1><br/>Not Found</div>
let Tree

if (process.env.CODE_SPLITTING) {
	Tree = require('react-router-proxy?name=vis!./components/vis/Tree.js');
} else {
	Tree = require('./components/vis/Tree').default;
}

export default () => (
	<Route path="/" component={App}>
		<IndexRoute component={TablePanel}/>
		<Route path="vis/:projectId" component={Tree}/>
		<Route path="*" component={NoMatch}/>
	</Route>
)
