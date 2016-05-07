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
    addJob: function (event) {
        if (event.keyCode == 13) {
            this.refs.newJob.value = '';
            this.props.addJob(this.props.type, this.refs.newJob.value);
        }
    },
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

                <li>
                    <input type="text" placeholder="Thêm mới" className="form-control" onKeyDown={this.addJob} ref="newJob" />
                </li>
            </ul>
        )
    }
});

var Content = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-sm-4">
                    <div className="panel panel-default todo">
                        <div className="panel-heading">
                            <h2>Cần làm</h2>
                        </div>

                        <PanelBody jobs={this.props.jobs.todo} type="todo"
                            removeJob={this.props.removeJob} addJob={this.props.addJob} />
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="panel panel-default doing">
                        <div className="panel-heading">
                            <h2>Đang làm</h2>
                        </div>

                        <PanelBody jobs={this.props.jobs.doing} type="doing"
                            removeJob={this.props.removeJob} addJob={this.props.addJob} />
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="panel panel-default done">
                        <div className="panel-heading">
                            <h2>Hoàn thành</h2>
                        </div>

                        <PanelBody jobs={this.props.jobs.done} type="done"
                            removeJob={this.props.removeJob} addJob={this.props.addJob} />
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
        var overrideStyle = {
            marginBottom: '30px'
        };

        return (
            <div className="container">
                <h1 className="text-center" style={overrideStyle}>Kanban board</h1>

                <Content jobs={this.state.jobs} removeJob={this.removeJob} addJob={this.addJob} />
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
                var removed;

                // Neu sort o cung context
                if (originContext == afterContext) {
                    // Xoa item o vi tri cu
                    removed = currentJob.splice(item.originIndex, 1)[0];

                    // Them item vua bi xoa vao vi tri moi
                    currentJob.splice(item.index(), 0, removed);

                    // Set lai bien jobs
                    jobs[originContext] = currentJob;
                } else {
                    var originJob = jobs[originContext];

                    // Xoa item o context cu va set lai bien job
                    removed = originJob.splice(item.originIndex, 1)[0];
                    jobs[originContext] = originJob;

                    // Them item o context moi va set lai bien job
                    currentJob.splice(item.index(), 0, removed);
                    jobs[afterContext] = currentJob;
                }

                // Cancel sortable
                $(this).sortable('cancel');

                // Set lai state sau khi cancel sortable
                self.setState({
                    jobs: jobs
                });
            }
        });
    }
});

ReactDOM.render(<App />, document.getElementById('content'));