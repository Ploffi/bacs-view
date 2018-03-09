import hljs from 'highlight.js/lib/highlight';
import withStyles from 'material-ui/styles/withStyles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const languages = ['cpp', 'cs'];
function register() {
    for (let lang of languages) {
        hljs.registerLanguage(lang, require(`highlight.js/lib/languages/${lang}`));
    }
}
require(`highlight.js/styles/github.css`);

register();

interface IHighlightProps {
    lang?: string;
    code: string;
    classes?: any;
}

class Highlighter extends React.Component<IHighlightProps, any> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.updateCodeBlockDOM();
    }

    render() {
        return <pre className={this.props.classes.font} >
            <code ref='code' className={this.props.lang || ''}>
            </code>
        </pre>
    }

    updateCodeBlockDOM() {
        const ele = ReactDOM.findDOMNode(this.refs.code);
        const autoDetect = !this.props.lang;
        try {
            if (autoDetect) {
                ele.innerHTML = hljs.highlightAuto(this.props.code).value;
            }
            else {
                ele.innerHTML = hljs.highlight(this.props.lang, this.props.code, true).value;
            }
        } catch (e) {
            console.warn(e);
            ele.innerHTML = this.props.code; // remove syntax highlight
        }
    }
};

const styles = {
    font: {
        fontFamily: "Consolas, 'Courier New', monospace"
    },
    placeholder: {
        width: '100%',
        minHeight: '500px',
    }
}

export default withStyles(styles)<IHighlightProps>(Highlighter as any);