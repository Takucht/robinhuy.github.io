var Heading = React.createClass({
    render: function() {
        return (
            <h1 className="text-center">Kanban board</h1>
        )
    }
});

var Content = React.createClass({
    render: function() {
        var style1 = {
            borderTopColor: '#d9edf7'
        };

        var style2 = {
            borderTopColor: '#fcf8e3'
        };

        var style3 = {
            borderTopColor: '#dff0d8'
        };

        return (
            <div className="row">
                <div className="col-sm-4 box" style={style1}>
                    <h2 className="text-center">Cần làm</h2>
                </div>

                <div className="col-sm-4 box" style={style2}>
                    <h2 className="text-center">Đang làm</h2>
                </div>

                <div className="col-sm-4 box" style={style3}>
                    <h2 className="text-center">Hoàn thành</h2>
                </div>
            </div>
        )
    }
});

var App = React.createClass({
    render: function() {
        return (
            <div className="container">
                <Heading />
                <Content />
            </div>
        )
    }
});

ReactDOM.render(<App />, document.getElementById('content'));