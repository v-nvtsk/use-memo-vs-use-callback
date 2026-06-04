import { useState, useMemo } from 'react';
import Demo from './Demo';
import rawDemoCode from './Demo.tsx?raw';
import rawLodashCode from './lodash-debounce.ts?raw';

import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

function App() {
	const [showSource, setShowSource] = useState(false);
	const [showLodashSource, setShowLodashSource] = useState(false);

	const highlightedCode = useMemo(() => {
		return Prism.highlight(rawDemoCode, Prism.languages.tsx, 'tsx');
	}, []);

	const highlightedLodashCode = useMemo(() => {
		return Prism.highlight(rawLodashCode, Prism.languages.typescript, 'typescript');
	}, []);

	return (
		<div className="container">
			<Demo />

			<div className="source-control">
				<div className="buttons-group" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '20px' }}>
					<button onClick={() => setShowSource(!showSource)} className="re-render-btn">
						{showSource ? "Скрыть код Demo.tsx" : "Показать код Demo.tsx"}
					</button>
					<button onClick={() => setShowLodashSource(!showLodashSource)} className="re-render-btn custom-btn">
						{showLodashSource ? "Скрыть код lodash-debounce.ts" : "Показать код lodash-debounce.ts"}
					</button>
				</div>
				<div style={{ display: 'flex', gap: '20px', flexDirection: 'column', alignItems: 'stretch' }}>
					{showSource && (
						<div>
							<h4 style={{ textAlign: 'left', margin: '0 0 8px 0' }}>Исходный код Demo.tsx:</h4>
							<pre className="code-viewer" style={{ marginTop: 0, maxHeight: '600px' }}>
								<code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
							</pre>
						</div>
					)}
					{showLodashSource && (
						<div>
							<h4 style={{ textAlign: 'left', margin: '0 0 8px 0' }}>Исходный код lodash-debounce.ts:</h4>
							<pre className="code-viewer" style={{ marginTop: 0, maxHeight: '600px' }}>
								<code dangerouslySetInnerHTML={{ __html: highlightedLodashCode }} />
							</pre>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;