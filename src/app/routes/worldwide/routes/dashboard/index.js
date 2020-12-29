import React, { Fragment } from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import {Area, AreaChart, ResponsiveContainer} from "recharts";
import ChartCard from "components/ChartCard";
import { connect } from 'react-redux'
import ContentLoader, { Facebook } from 'react-content-loader'
import {Card, CardBody, CardSubtitle, CardText} from 'reactstrap';
import Highstock from 'highcharts/highstock';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Moment from 'moment';
import mapDataWorld from 'components/Highmaps/world-highres';

import { getTimeline, getSummary, getDataCountries } from 'actions/NovelCovid';

require('highcharts/modules/map')(Highcharts);

const MyLoader = (props) => (
    <ContentLoader 
      speed={3}
      width={383}
      height={122}
      viewBox="0 0 383 122"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
        <rect x="24" y="16" rx="3" ry="3" width="80" height="15" /> 
        <rect x="24" y="56" rx="3" ry="3" width="119" height="21" /> 
        <rect x="24" y="85" rx="3" ry="3" width="159" height="18" />
    </ContentLoader>
);

const TimelineCoronaApiCharts = ({ timeline_data }) => {
    const options = {
        chart: {
            zoomType: 'x',
        },

        title: {
            text: 'Graph of the growth of the coronavirus in the world'
        },

        subtitle: {
            text: 'src: https://corona.lmao.ninja/'
        },

        rangeSelector: {
            allButtonsEnabled: true,
            selected: 1,
            buttons: [{
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }, {
                type: 'ytd',
                text: 'YTD'
            }, {
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'all',
                text: 'All'
            }]
        },
    
        yAxis: {
            title: {
                text: 'Person'
            },
            min: 0
        },

        xAxis: {
            type: 'datetime',
            pointInterval: 'month',
            ordinal: false,
            pointStart: Date.UTC(2020, 0, 1),
            events: {
                afterSetExtremes: function(e) {
                    var minDistance = 1 * 30 * 24 * 3600 * 1000; //36 months time
                    var xaxis = this;
                    if ((e.max - e.min) < minDistance) {
                        var min = e.max - minDistance;
                        var max = e.max;
                        window.setTimeout(function() {
                            xaxis.setExtremes(min, max);
                        }, 10);
                    }
                }
            },
            title: "Tanggal"
        },
    
        plotOptions: {
            line: {
                gapUnit: 'value',
                gapSize: 3600000,
                softThreshold:false,
                dataGrouping:{  
                    enabled:false,
                    approximation:"average",
                    groupPixelWidth:4
                },
            },
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            shared:true,
            formatter: function() {
              var pointsForTooltip = this.points,
                tooltipsStrings = [],
                returnString = '',
                currentPointIndex,
                currentPointValue,
                previousPointValue,
                title,
                compareValue;
              pointsForTooltip.forEach(function(el, inx) {
                currentPointIndex = el.point.index;
                currentPointValue = el.y.toFixed(0);
                title = Moment.unix(el.x/1000).format("DD MMMM YYYY")
                if (currentPointIndex !== (el.series.yData.length-1)) {
                    previousPointValue = el.series.yData[currentPointIndex+1].toFixed(0);
                    compareValue = ((currentPointValue-previousPointValue) * 100 / currentPointValue).toFixed(2);
                }

                if (compareValue === undefined) {
                    compareValue = '';
                }else {
                    compareValue = ` ( ${(compareValue > 0 ? '+'+compareValue : compareValue)}% )`;
                }

                tooltipsStrings.push('<b>' + el.series.name + ':</b> ' + currentPointValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + compareValue + '<br/>');
              });
              returnString = `<b>${title}</b> <br/>`
              tooltipsStrings.forEach(function(el) {
                returnString += el;
              });
    
              return returnString;
            },
          },
        series: timeline_data,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        height: 300
                    },
                    subtitle: {
                        text: null
                    },
                    navigator: {
                        enabled: false
                    }
                }
            }]
        }
    };
    
    return (
        <div>
            <HighchartsReact
                highcharts={Highstock}
                constructorType={'stockChart'}
                options={options}
            />
        </div>
    )
}

const topTenCountryChart = ({data, title}) => {
    const options = {
        chart: {
            type: 'bar',
            marginTop: 130
        },

        title: {
            text: title
        },

        subtitle: {
            text: 'src: https://corona.lmao.ninja/'
        },

        xAxis: {
            labels: 'Country',
            title: {
                text: 'Country'
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: 'People',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            headerFormat: ''
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'horizontal',
            align: 'right',
            alignColumns: true,
            verticalAlign: 'top',
            x: 0,
            y: 70,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true,
            width: 485,
            itemDistance: 5,
        },
        credits: {
            enabled: false
        },

        series: data,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        height: 300
                    },
                    subtitle: {
                        text: null
                    },
                    navigator: {
                        enabled: false
                    }
                }
            }]
        }
    };
    
    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}

let mapOptions = {}

const worldMap = ({rawData}) => {
    const asdawe = rawData.map((v, i) => {
        return {'hc-key': v.countryInfo.iso2 === null ? v.countryInfo.iso3: v.countryInfo.iso2, value: v.cases }
    });

    console.log(asdawe);

    mapOptions = {

        title: {
            text: null
        },

        colorAxis: {
            min: 0,
            stops: [
                [0, '#EFEFFF'],
                [0.5, Highcharts.getOptions().colors[0]],
                [1, Highcharts.color(Highcharts.getOptions().colors[0]).brighten(-0.5).get()]
            ]
        },

        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom'
        },

        series: [{
            mapData: mapDataWorld,
            data: asdawe,
            // joinBy: ['hc-key', 'name'],
            animation: true,
            name: 'World',
        }]
    };
    
    return 0;
}

class DashboardPage extends React.Component {
    state = {
        TotalConf: null,
    }

  componentDidMount() {
      this.props.getSummary();
      this.props.getTimeline({});
      this.props.getDataCountries({sort: 'cases'});
  }

  render() {
    const ConfirmedData =  [
        {name: 'Januari', pv: 18160},
        {name: 'Februari', pv: 85217},
        {name: 'Maret', pv: 856527},
        {name: 'April', pv: 3254831},
        {name: 'Mei', pv: 6164489},
        {name: 'Juni', pv: 10469512},
        {name: 'Juli', pv: 17485467},
        {name: 'Agustus', pv: 25447752},
        {name: 'September', pv: 33901417},
        {name: 'Oktober', pv: 45944172},
        {name: 'November', pv: 63020127},
        {name: 'Desember', pv: 78814244},
    ];

    const RecoveredData =  [
        {name: 'Januari', pv: 365},
        {name: 'Februari', pv: 39745},
        {name: 'Maret', pv: 177407},
        {name: 'April', pv: 1013756},
        {name: 'Mei', pv: 2639339},
        {name: 'Juni', pv: 5350371},
        {name: 'Juli', pv: 10293475},
        {name: 'Agustus', pv: 16794743},
        {name: 'September', pv: 23592227},
        {name: 'Oktober', pv: 30725052},
        {name: 'November', pv: 40368013},
        {name: 'Desember', pv: 54946266},
    ];

    const DeathsData =  [
        {name: 'Januari', pv: 384},
        {name: 'Februari', pv: 2934},
        {name: 'Maret', pv: 42094},
        {name: 'April', pv: 233343},
        {name: 'Mei', pv: 371981},
        {name: 'Juni', pv: 511173},
        {name: 'Juli', pv: 677162},
        {name: 'Agustus', pv: 849874},
        {name: 'September', pv: 1013037},
        {name: 'Oktober', pv: 1193013},
        {name: 'November', pv: 1464283},
        {name: 'Desember', pv: 1736636},
    ];

    const defaultData = [
        {name: 'Page A', pv: 200},
        {name: 'Page B', pv: 1200},
        {name: 'Page C', pv: 600},
        {name: 'Page D', pv: 1600},
        {name: 'Page D', pv: 1000},
        {name: 'Page H', pv: 2260},
        {name: 'Page K', pv: 800},
    ];

    const {
        summary_data,
        summaryLoading,
        summaryReady,
        timeline_data, 
        timelineLoading, 
        timelineReady,
        country_data, 
        loadingDataCountry, 
        dataCountryReady,
    } = this.props;

    return (
        <Fragment>
            <ContainerHeader match={this.props.match} title="Dashboard" />
            <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                    { summaryLoading && <Card className={`shadow border-0 bg-white`} style={{ height: '120px' }}>
                        {MyLoader()}
                    </Card> }
                    { summaryReady && <ChartCard chartProperties={{
                            title: 'CASES',
                            prize: summary_data.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            icon: 'stats',
                            bgColor: 'indigo',
                            styleName: 'up',
                            desc: `${summary_data.todayCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} New Cases`,
                            percent: '',
                        }}
                        children={<ResponsiveContainer width="100%" height={75}>
                        <AreaChart data={defaultData}
                                    margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                            <Area dataKey='pv' type='monotone' strokeWidth={0} stackId="2" stroke='#273894' fill="#273894"
                                fillOpacity={1}/>
                        </AreaChart>
                        </ResponsiveContainer>}
                    />}
                </div>
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                    { summaryLoading && <Card className={`shadow border-0 bg-white`} style={{ height: '120px' }}>
                        {MyLoader()}
                    </Card> }
                    { summaryReady && <ChartCard chartProperties={{
                            title: 'ACTIVE',
                            prize: summary_data.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            icon: 'stats',
                            bgColor: 'pink accent-2',
                            styleName: 'up',
                            desc: `${summary_data.todayCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Critical`,
                            percent: '',
                        }}
                        children={<ResponsiveContainer width="100%" height={75}>
                        <AreaChart data={defaultData}
                                    margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                            <Area dataKey='pv' type='monotone' strokeWidth={0} stackId="2" stroke='#da2361' fill='#da2361' fillOpacity={1}/>
                        </AreaChart>
                        </ResponsiveContainer>}
                    />}
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    { summaryLoading && <Card className={`shadow border-0 bg-white`} style={{ height: '120px' }}>
                        {MyLoader()}
                    </Card> }
                    { summaryReady && <ChartCard
                        chartProperties={{
                        title: 'RECOVERED',
                        prize: summary_data.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        icon: 'stats',
                        bgColor: 'success',
                        styleName: 'up',
                        desc: `${summary_data.todayRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} New Recovered`,
                        percent: '',
                        }}
                        children={<ResponsiveContainer width="100%" height={75}>
                        <AreaChart data={defaultData}
                                    margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                            <Area dataKey='pv' type='monotone' strokeWidth={0} stackId="2" stroke='#3a983e' fill='#3a983e'
                                fillOpacity={1}/>
                        </AreaChart>
                        </ResponsiveContainer>}
                    />}
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    { summaryLoading && <Card className={`shadow border-0 bg-white`} style={{ height: '120px' }}>
                        {MyLoader()}
                    </Card> }
                    { summaryReady && <ChartCard
                        chartProperties={{
                        title: 'DEATHS',
                        prize: summary_data.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        icon: 'stats',
                        bgColor: 'danger',
                        styleName: 'down',
                        desc: `${summary_data.todayDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} New Deaths`,
                        percent: '',
                        }}
                        children={<ResponsiveContainer width="100%" height={75}>
                        <AreaChart data={defaultData} margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                            <Area dataKey='pv' type='monotone' strokeWidth={0} stackId="2" stroke='#C3362B' fill='#C3362B' fillOpacity={1}/>
                        </AreaChart>
                        </ResponsiveContainer>}
                    />}
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Card className="shadow border-0">
                        <CardBody>
                            {/* { dataCountryReady && worldMap({rawData: country_data.rawData})} */}
                            {dataCountryReady && <HighchartsReact
                                options={{

                                    title: {
                                        text: 'Map of analysis of the number of corona virus patients in the world'
                                    },

                                    subtitle: {
                                        text: 'src: https://corona.lmao.ninja/'
                                    },
                                    
                                    mapNavigation: {
                                        enabled: true
                                    },
                            
                                    colorAxis: {
                                        min: 0,
                                        stops: [[0, '#EFEFFF'], [0.1, '#f5e9e8'], [0.2, '#ebd4d2'], [0.3, '#e1bfbc'], [0.4, '#d7aaa6'], [0.5, '#cd9590'], [0.6, '#c37f7a'], [0.7, '#b96a64'], [0.8, '#af554e'], [0.9, '#a54038'], [1, '#9C2B22']],
                                    },
                            
                                    legend: {
                                        layout: 'vertical',
                                        align: 'left',
                                        verticalAlign: 'bottom'
                                    },
                            
                                    series: [{
                                        mapData: mapDataWorld,
                                        data: country_data.dataCovidDunia,
                                        animation: true,
                                        name: 'World',
                                        states: {
                                            hover: {
                                                color: Highcharts.getOptions().colors[1]
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            format: '{point.name}'
                                        },
                                    }],

                                    tooltip: {
                                        formatter: function(){
                                            console.log(this.point)
                                            var s = `<tspan style="fill: ${this.point.color}">●</tspan> <span style="color: 'black'">${this.key}</span><br/>`;
                                            s += 'Cases: ' + this.point.options.data.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '<br/>';
                                            s += 'Active: ' + this.point.options.data.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '<br/>';
                                            s += 'Recovered: ' + this.point.options.data.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '<br/>';
                                            s += 'Deaths: ' + this.point.options.data.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            return s;
                                        },
                                    },
                                }}
                                constructorType={'mapChart'}
                                highcharts={Highcharts}
                            />}
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Card className="shadow border-0">
                        <CardBody>
                            { timelineReady &&  TimelineCoronaApiCharts({timeline_data})}
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <Card className="shadow border-0">
                        <CardBody>
                            { dataCountryReady && topTenCountryChart({data: country_data.confirmed, title: '10 countries with the most people infected with the corona virus in the world'}) }
                        </CardBody>
                    </Card>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <Card className="shadow border-0">
                        <CardBody>
                            { dataCountryReady && topTenCountryChart({data: country_data.active, title: '10 countries with the most active corona virus patients in the world'}) }
                        </CardBody>
                    </Card>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <Card className="shadow border-0">
                        <CardBody>
                            { dataCountryReady && topTenCountryChart({data: country_data.recovered, title: 'The 10 countries with the most people recovered from the corona virus in the world'}) }
                        </CardBody>
                    </Card>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <Card className="shadow border-0">
                        <CardBody>
                            { dataCountryReady && topTenCountryChart({data: country_data.deaths, title: 'The 10 countries with the most deaths due to the corona virus in the world'}) }
                        </CardBody>
                    </Card>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <Card className="shadow border-0">
                        <CardBody>
                            { dataCountryReady && topTenCountryChart({data: country_data.recoveredRate, title: '10 countries with the highest cure rates of the total corona virus (%)'}) }
                        </CardBody>
                    </Card>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <Card className="shadow border-0">
                        <CardBody>
                            { dataCountryReady && topTenCountryChart({data: country_data.deathsRate, title: 'The 10 countries with the highest death rates from the total corona virus (%)'}) }
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div className="app-wrapper">
                <div className="d-flex justify-content-center">
                    {summaryLoading && <em>Loading ...</em>}
                    <h1><IntlMessages id="pages.samplePage.description"/></h1>
                </div>
            </div>
        </Fragment>
    );
  }
}

const mapStateToProps = ({novelCovid}) => {
    const { summary_data, summaryLoading, summaryReady, timeline_data, timelineLoading, timelineReady, country_data, loadingDataCountry, dataCountryReady } = novelCovid;
    return { summary_data, summaryLoading, summaryReady, timeline_data, timelineLoading, timelineReady, country_data, loadingDataCountry, dataCountryReady } 
}

export default connect(mapStateToProps, { getSummary, getTimeline, getDataCountries })(DashboardPage);