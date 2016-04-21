var Box = React.createClass({
    render: function () {
        return (
            <div className="box">
                <Paragraph number="1"/>
                <Paragraph number="2"/>
                <Paragraph number="3"/>
                <Paragraph number="2">
                    *Special*
                </Paragraph>
            </div>
        );
    }
});

var Paragraph = React.createClass({
    render: function () {
        var content = this.props.children;
        if (content)
            content = {__html: marked(content.toString())};

        return (
            <p dangerouslySetInnerHTML={ content }></p>
        );
    }
});

ReactDOM.render(
    <Box />,
    document.getElementById('content')
);