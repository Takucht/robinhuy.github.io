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

var PanelHeading = React.createClass({
    render: function () {
        var displayButton = this.props.title != "Hoàn thành";

        return (
            <div className="panel-heading">
                <h2>{this.props.title}</h2>

                { displayButton ?
                    <div className="btn-group btn-heading">
                        <button type="button" className="btn btn-default dropdown-toggle"
                            data-toggle="modal" data-target={"#modal-new-card-" + this.props.type}>
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>
                    </div>
                    : null }
            </div>
        )
    }
});

var PanelBody = React.createClass({
    removeJob: function(){
        this.props.removeJob(this.props.type);
    },
    render: function () {
        return (
            <ul className="list-unstyled">
                {
                    this.props.jobs.map(function (job, index) {
                        return (
                            <li key={index}>
                                {job}
                                <i className="glyphicon glyphicon-trash pull-right" onClick={this.removeJob}></i>
                            </li>
                        )
                    })
                    }
            </ul>
        )
    }
});

var Modal = React.createClass({
    addJob: function () {
        this.props.addJob(this.props.type, this.refs.description.value);
    },
    render: function () {
        var margin = {
            marginRight: '10px'
        };

        var title = 'Thêm việc ';
        if (this.props.type == 'todo')
            title += 'cần làm';
        else
            title += 'đang làm';

        return (
            <div className="modal fade" id={"modal-new-card-" + this.props.type} tabindex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="form-group">
                                <h4>{title}</h4>
                                <input type="text" className="form-control" ref="description"/>
                            </div>

                            <div className="form-group text-right">
                                <button type="button" className="btn btn-default" data-dismiss="modal" style={margin}>Đóng</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.addJob}>Thêm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var Content = React.createClass({
    getInitialState: function () {
        return {
            jobs: this.props.jobs
        }
    },
    render: function () {
        console.log(this.props.removeJob);
        return (
            <div className="row">
                <div className="col-sm-4">
                    <div className="panel panel-default todo">
                        <PanelHeading title="Cần làm" type="todo" />
                        <PanelBody jobs={this.props.jobs.todo} removeJob={this.props.removeJob} />
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="panel panel-default doing">
                        <PanelHeading title="Đang làm" type="doing" />
                        <PanelBody jobs={this.props.jobs.doing} />
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="panel panel-default done">
                        <PanelHeading title="Hoàn thành" type="done" />
                        <PanelBody jobs={this.props.jobs.done} />
                    </div>
                </div>
            </div>
        )
    }
});

var App = React.createClass({
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
    addJob: function (type, text) {
        var jobs = this.state.jobs;
        var jobType = this.state.jobs[type];
        jobType.push(text || 'New Job');
        jobs[type] = jobType;

        this.setState({
            jobs: jobs
        })
    },
    removeJob: function (type, key) {
        var jobs = this.state.jobs;
        var jobType = this.state.jobs[type];
        jobType.splice(key, 1);
        jobs[type] = jobType;

        this.setState({
            jobs: jobs
        })
    },
    render: function () {
        return (
            <div className="container">
                <Heading />
                <Content jobs={this.state.jobs} removeJob={this.removeJob} />
                <Modal type="todo" addJob={this.addJob} />
                <Modal type="doing" addJob={this.addJob} />
            </div>
        )
    },
    componentDidMount: function () {
        $('.list-unstyled').sortable({
            connectWith: '.list-unstyled'
        }).disableSelection();
    }
});

ReactDOM.render(<App />, document.getElementById('content'));