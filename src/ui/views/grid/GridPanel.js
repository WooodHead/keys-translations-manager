import 'ag-grid/dist/styles/ag-grid.css'
import 'ag-grid/dist/styles/theme-fresh.css'
import React from 'react'
import {AgGridReact} from 'ag-grid-react/lib/agGridReact'
import {reactCellRendererFactory} from 'ag-grid-react/lib/reactCellRendererFactory';
import Input from 'react-bootstrap/lib/Input'
import ActionCellRenderer from './ActionCellRenderer'
import ProjectCellRenderer from './ProjectCellRenderer'
import TranslationActions from '../../actions/TranslationActions'
import config from '../../../config'

export default class GridPanel extends React.Component {

    constructor() {
        super();
        const locales = config.locales;
        let localeCols = locales.map(function(locale){
            return {
                headerName: locale,
                field: locale,
                editable: true,
                newValueHandler: function(params) {
                    console.log(params, this);
                    params.data[this.field] = params.newValue;
                    TranslationActions.updateTranslation(params.data);
                }
            };
        });

        let columnDefs = [{
                headerName: "actions",
                field: '_id',
                pinned: true,
                width: 70,
                suppressSorting: true,
                cellRenderer: reactCellRendererFactory(ActionCellRenderer)
            }, {
                headerName: "apply to",
                field: 'project',
                pinned: true,
                cellRenderer: reactCellRendererFactory(ProjectCellRenderer)
            }, {
                headerName: "key",
                field: "key",
                pinned: true
            }, {
                headerName: 'Locales',
                children: localeCols
            }
        ];

        this.state = {
            quickFilterText: null,
            columnDefs: columnDefs,
            rowData: [],
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
            }
        };

        this.gridOptions = {
            rowBuffer: 10,
            localeText: {
                noRowsToShow: "No data to display"
            }
        };
    }

    onQuickFilterText(event) {
        this.setState({quickFilterText: event.target.value});
    }

    render() {
        return (
            <div style={{width: '100%'}}>
                <Input type="text" onChange={this.onQuickFilterText.bind(this)}
                    placeholder="Filter" style={{width:"200px"}}/>

                <div style={{height: '300px'}} className="ag-fresh">
                    <AgGridReact
                        gridOptions={this.gridOptions}
                        quickFilterText={this.state.quickFilterText}
                        icons={this.state.icons}
                        columnDefs={this.state.columnDefs}
                        rowData={this.props.translations}
                        enableColResize="true"
                        enableSorting="true"
                        groupHeaders="true"
                        rowHeight="28"
                    />
                </div>
            </div>
        );
    }

}
