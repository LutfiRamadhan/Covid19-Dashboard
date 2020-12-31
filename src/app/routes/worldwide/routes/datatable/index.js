import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardBody } from 'reactstrap';
import ContainerHeader from 'components/ContainerHeader/index';
import { Button } from '@material-ui/core';
import DetailIcon from '@material-ui/icons/Details';
import MUIDataTable from 'mui-datatables';

import { getDataCountries } from 'actions/NovelCovid';

class Datatable extends Component {
    state = {
        columns: [
            { name: 'country', label: 'Country' },
            { name: 'cases', label: 'Cases', options: { filter: false } },
            { name: 'active', label: 'Active', options: { filter: false } },
            { name: 'recovered', label: 'Recovered', options: { filter: false } },
            { name: 'Deaths', label: 'Deaths', options: { filter: false } },
            { name: 'recovered_rate', label: 'Recovered Rate', options: { filter: false } },
            { name: 'deaths_rate', label: 'Deaths Rate', options: { filter: false } },
            {
                name: 'Action', options: {
                    customBodyRender: (dataIndex, data) => {
                        return (
                            <Button
                                variant="contained"
                                className="bg-primary text-white"
                                onClick={() => {
                                    this.props.history.push(`/app/worldwide/${data.tableData[data.rowIndex].id}`)
                                }}
                                startIcon={<DetailIcon />}
                            >
                                Detail
                            </Button>
                        );
                    }
                }
            }
        ]
    }

    componentDidMount() {
        this.props.getDataCountries({});
    }

    render() {
        const {
            country_data,
            dataCountryReady,
            loadingDataCountry,
        } = this.props;

        const {
            columns
        } = this.state

        const options = {
            filterType: 'dropdown'
        }

        return (
            <Fragment>
                <ContainerHeader match={this.props.match} title="Data Table" />
                <div className="row">
                    <div className="col-12">
                        <Card className="shadow border-0">
                            <CardBody>
                                <MUIDataTable title="List Countries" data={country_data} columns={columns} options={options} />
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateProps = ({ novelCovid }) => {
    const { country_data, dataCountryReady, loadingDataCountry } = novelCovid;
    tmpCountryData = country_data
    return { country_data, dataCountryReady, loadingDataCountry }
};

export default connect(mapStateProps, { getDataCountries })(Datatable);