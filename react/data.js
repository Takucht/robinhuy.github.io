var Wrapper = React.createClass({
    render: function () {
        return (
            <div class="wrapper">
                <h1>Food</h1>
                <List data={this.props.data} />
            </div>
        );
    }
});

var List = React.createClass({
    render: function () {
        var item = this.props.data.map(function (data) {
            return (
                <li>{data}</li>
            )
        });

        return (
            <ul>
                {item}
            </ul>
        );
    }
});

var food = ['Banana', 'Bread', 'Rice'];

ReactDOM.render(
    <Wrapper data={food} />,
    document.getElementById('content')
);