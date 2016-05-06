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
        return (
            <div className="panel-heading">
                <h2>{this.props.title}</h2>

                <div className="btn-group btn-heading">
                    <button type="button" className="btn btn-default dropdown-toggle"
                        data-toggle="modal" data-target={"#modal-new-card-" + this.props.type}>
                        <span className="glyphicon glyphicon-plus"></span>
                    </button>
                </div>
            </div>
        )
    }
});

var Trash = React.createClass({
    removeJob: function () {
        // Remove job by key
        this.props.removeJob(this.props.itemKey)
    },
    render: function () {
        return (
            <i className="glyphicon glyphicon-trash pull-right" onClick={this.removeJob}></i>
        )
    }
});

var PanelBody = React.createClass({
    render: function () {
        var self = this;
        var type = self.props.type;

        return (
            <ul className="list-unstyled" data-type={type}>
                {
                    this.props.jobs.map(function (job, index) {
                        return (
                            <li key={type + '-' + index} data-id={type + '-' + index}>
                                {job}
                                <Trash type={type} itemKey={type + '-' + index} removeJob={self.props.removeJob} />
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

        // Set modal title
        var title = 'Thêm việc ';
        if (this.props.type == 'todo')
            title += 'cần làm';
        else if (this.props.type == 'doing')
            title += 'đang làm';
        else
            title += 'đã hoàn thành';

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
        return (
            <div className="row">
                <div className="col-sm-4">
                    <div className="panel panel-default todo">
                        <PanelHeading title="Cần làm" type="todo" />
                        <PanelBody jobs={this.props.jobs.todo} type="todo" removeJob={this.props.removeJob} />
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="panel panel-default doing">
                        <PanelHeading title="Đang làm" type="doing" />
                        <PanelBody jobs={this.props.jobs.doing} type="doing" removeJob={this.props.removeJob} />
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="panel panel-default done">
                        <PanelHeading title="Hoàn thành" type="done" />
                        <PanelBody jobs={this.props.jobs.done} type="done" removeJob={this.props.removeJob} />
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
        jobType.push(text || 'Chưa nghĩ ra');
        jobs[type] = jobType;

        this.setState({
            jobs: jobs
        });
    },
    removeJob: function (key) {
        // Lay ra loai job can xoa va vi tri can xoa
        var keys = key.split('-');
        var type = keys[0];
        var index = keys[1];
        var jobs = this.state.jobs;
        var jobType = this.state.jobs[type];
        jobType.splice(index, 1);
        jobs[type] = jobType;

        this.setState({
            jobs: jobs
        });
    },
    render: function () {
        return (
            <div className="container">
                <Heading />
                <Content jobs={this.state.jobs} removeJob={this.removeJob} />
                <Modal type="todo" addJob={this.addJob} />
                <Modal type="doing" addJob={this.addJob} />
                <Modal type="done" addJob={this.addJob} />
            </div>
        )
    },
    componentDidMount: function () {
        var self = this;

        // Khoi tao sortable
        $('.list-unstyled').sortable({
            connectWith: '.list-unstyled',
            start: function (event, ui) {
                // Lay vi tri va context ban dau
                ui.item.originContext = ui.item.context.parentElement.getAttribute('data-type');
                ui.item.originIndex = ui.item.index();
            },
            stop: function (event, ui) {
                var jobs = self.state.jobs;
                var item = ui.item;
                var originContext = item.originContext;
                var afterContext = item.context.parentElement.getAttribute('data-type');
                var currentJob = jobs[afterContext];

                // Neu sort o cung context
                if (originContext == afterContext) {
                    // Xoa item o vi tri cu va add vao vi tri moi
                    currentJob.splice(item.index(), 0, currentJob.splice(item.originIndex, 1)[0]);
                    jobs[originContext] = currentJob;

                    // Set new state
                    self.setState({
                        jobs: jobs
                    });
                } else {
                    var originJob = jobs[originContext];

                    // Xoa item o context cu
                    var removed = originJob.splice(item.originIndex, 1)[0];
                    jobs[originContext] = originJob;

                    // Them item o context moi
                    currentJob.splice(item.index(), 0, removed);

                    // Set new state
                    self.setState({
                        jobs: jobs
                    });
                }

                // Cancel sortable
                $(this).sortable('cancel');
            }
        }).disableSelection();
    }
});

ReactDOM.render(<App />, document.getElementById('content'));