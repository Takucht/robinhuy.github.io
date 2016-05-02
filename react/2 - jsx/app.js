var Heading = React.createClass({
    render: function() {
        var margin = {
            marginBottom: '30px'
        };

        return (
            <h1 className="text-center" style={margin}>Kanban board</h1>
        )
    }
});

var Content = React.createClass({
    render: function() {
        return (
            <div className="row">
                <div className="col-sm-4 box todo">
                    <h2 className="text-center">Cần làm</h2>
                </div>

                <div className="col-sm-4 box doing">
                    <h2 className="text-center">Đang làm</h2>
                </div>

                <div className="col-sm-4 box done">
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