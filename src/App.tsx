import { useState, useMemo } from 'react';
import Demo from './Demo';
import rawDemoCode from './Demo.tsx?raw';

import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

function App() {
	const [showSource, setShowSource] = useState(false);

	const highlightedCode = useMemo(() => {
		return Prism.highlight(rawDemoCode, Prism.languages.tsx, 'tsx');
	}, []);

	return (
		<div className="container">
			<Demo />

			<div className="source-control">
				<button onClick={() => setShowSource(!showSource)} className="re-render-btn">
					{showSource ? "Скрыть исходный код" : "Показать исходный код Demo.tsx"}
				</button>
				{showSource && (
					<pre className="code-viewer">
						<code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
					</pre>
				)}
			</div>
		</div>
	);
}

export default App;