var Heading = React.createClass({
    render: function () {
        var margin = {
            marginBottom: '30px'
        };

        return (
            <h1 className="text-center" style={margin}>Kanban board</h1>
        )
    }
});

var Modal = React.createClass({
    addJob: function () {

    },
    render: function () {
        var margin = {
            marginRight: '10px'
        };

        return (
            <div className="modal fade" id="modal-new-card" tabindex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="form-group">
                                <h4>Mô tả công việc</h4>
                                <textarea className="form-control" rows="3"></textarea>
                            </div>

                            <div className="form-group text-right">
                                <button type="button" className="btn btn-default" data-dismiss="modal" style={margin}>Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={this.addJob()}>Thêm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var PanelHeading = React.createClass({
    render: function () {
        var displayButton = this.props.title != "Hoàn thành";

        return (
            <div className="panel-heading">
                <h2>{this.props.title}</h2>

                { displayButton ?
                    <div className="btn-group btn-heading">
                        <button type="button" className="btn btn-default dropdown-toggle"
                            data-toggle="modal" data-target="#modal-new-card">
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>
                    </div>
                    : null }
            </div>
        )
    }
});

var PanelBody = React.createClass({
    render: function () {
        return (
            <ul className="list-unstyled">
                {this.props.jobs.map(function (job, index) {
                    return <li key={index}>{job}</li>
                })}
            </ul>
        )
    }
});

var Content = React.createClass({
    getInitialState: function () {
        return {
            jobs: {
                todo: [
                    'Tạo khung bài giảng React',
                    'Tạo ví dụ demo',
                    'Quay video hướng dẫn'
                ],
                doing: [],
                done: []
            }
        }
    },
    render: function () {
        return (
            <div className="row">
                <div className="col-sm-4">
                    <div className="panel panel-default todo">
                        <PanelHeading title="Cần làm" />
                        <PanelBody jobs={this.state.jobs.todo} />
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="panel panel-default doing">
                        <PanelHeading title="Đang làm" />
                        <PanelBody jobs={this.state.jobs.doing} />
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="panel panel-default done">
                        <PanelHeading title="Hoàn thành" />
                        <PanelBody jobs={this.state.jobs.done} />
                    </div>
                </div>
            </div>
        )
    }
});

var App = React.createClass({
    render: function () {
        return (
            <div className="container">
                <Heading />
                <Content />
                <Modal />
            </div>
        )
    }
});

ReactDOM.render(<App />, document.getElementById('content'));