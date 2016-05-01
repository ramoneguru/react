/**
 * Created by ifthenelse on 4/22/16.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var Element = require('../components/Element');
var ElementDisplay = require('../components/ElementDisplay');
var Preview = require('../components/Preview');
var List = require('../components/List');
var Sorter = require('../components/Sorter');
var Filter = require('../components/Filter');
var Helpers = require('../utils/elementHelpers');

var update = require('react-addons-update');

require('../styles/components/elementContainer.scss');
require('../styles/components/element.scss');
require('../styles/components/form.scss');

var ElementContainer = React.createClass({
	getInitialState: function() {
		return {
			element: {
				number: '0',
				symbol: 'Ex',
				name: 'Symbol name',
				weight: '0',
				color: '#757575',
				type: 'metal',
				originalIndex: 0,
				visible: true,
				top: 0,
				left: 0
			},
			elementWidth: 100,
			elementHeight: 100,
			elementPadding: 10,
			elementFullWidth: 110,
			elementFullHeight: 110,
			elementListColumns: 3,
			elementListHeight: 300,
			elementList: [
				{
					"number": "1",
					"symbol": "K",
					"name": "Potassium",
					"weight": "1.23",
					"color": "red",
					"originalIndex": 0,
					"visible": true,
					"type": 'metal',
					"top": 0,
					"left": 0
				},
				{
					"number": "22",
					"symbol": "He",
					"name": "Helium",
					"weight": "1",
					"color": "teal",
					"originalIndex": 1,
					"visible": true,
					"type": 'transition',
					"top": 0,
					"left": 0
				},
				{
					"number": "12",
					"symbol": "Fe",
					"name": "Iron",
					"weight": "32.3",
					"color": "blue",
					"originalIndex": 2,
					"visible": true,
					"type": 'ium',
					"top": 0,
					"left": 0
				},
				{
					"number": "12",
					"symbol": "Se",
					"name": "Iron",
					"weight": "32.3",
					"color": "blue",
					"originalIndex": 3,
					"visible": true,
					"type": 'metal',
					"top": 0,
					"left": 0
				}
			]
		}
	},
	componentDidMount: function() {
		this.handleListResize();
	},
	handleSubmitElement: function(e) {
		var element, list;
		e.preventDefault();

		element = {
			"number": this.state.element.number,
			"symbol": this.state.element.symbol,
			"name": this.state.element.name,
			"weight": this.state.element.weight,
			"color": this.state.element.color,
			"type": this.state.element.type,
			"originalIndex": this.state.elementList.length - 1,
			"visible": true,
			"top": 0,
			"left": 0
		};

		list = update(this.state.elementList, {$push: [element]});
		this.setState({
			elementList: list
		}, () => {
			this.handleListResize();
		});
	},
	handleUpdateElement: function(e) {
		var updatedElement, obj = {};
		obj[e.target.id] = e.target.value;
		updatedElement = update(this.state.element, {$merge: obj});
		this.setState({
			element: updatedElement
		})
	},

	handleSorting: function(sortBy) {
		var list = this.state.elementList.slice(0);
		Helpers.getVisibleItems(list).sort((prev, curr) => {
			return Helpers.getSortByLargest(prev, curr, sortBy);
		}).map((item, i) => {
			this.setOffset(item, i);
		});

		this.setState({
			elementList: list
		});
	},

	handleFiltering: function(filter) {
		var list = this.state.elementList.slice(0);
		var filterList = list.filter((item) => {
			if(item.type === filter || filter === "all") {
				item.visible = true;
				return true;
			} else {
				item.visible = false;
				return false;
			}
		});

		this.setState({
			elementList: list
		}, () => {
			this.handleListResize();
		});

	},

	handleListResize: function(e) {
		var listCurrentWidth = ReactDOM.findDOMNode(this.refs.element_list).offsetWidth;
		var list = this.state.elementList.slice(0);
		var visibleList = Helpers.getVisibleItems(list);
		var dimensions = Helpers.getRowsAndColumns(visibleList.length, listCurrentWidth, this.state.elementFullWidth);

		visibleList.map((item, i) => {
			return this.setOffset(item, i, dimensions.columns);
		});

		this.setState({
			elementListColumns: dimensions.columns,
			elementList: list,
			elementListHeight: (dimensions.rows * this.state.elementFullHeight)
		});
	},

	setOffset: function(item, i, cols) {
		var top, left, elementWidth = this.state.elementFullWidth, elementHeight = this.state.elementFullHeight,
			cols = (cols === undefined) ? this.state.elementListColumns : cols;

		if(i % cols === 0) {
			top = (i === 0) ? 0 : Math.floor(i / cols) * elementHeight;
			left = 0;
		} else {
			top = Math.floor(i / cols) * elementHeight;
			left = (i % cols) * elementWidth;
		}
		item.top = top;
		item.left = left;
		return item;
	},
	render: function() {
		return (
			<div className="element-container">
				<Element
					onSubmitElement={this.handleSubmitElement}
					onUpdateElementNumber={this.handleUpdateElement}
					onUpdateElementSymbol={this.handleUpdateElement}
					onUpdateElementName={this.handleUpdateElement}
					onUpdateElementWeight={this.handleUpdateElement}
					onUpdateElementColor={this.handleUpdateElement}
					onUpdateElementType={this.handleUpdateElement}
				/>
				<Preview>
					<ElementDisplay
						number={this.state.element.number}
						symbol={this.state.element.symbol}
						name={this.state.element.name}
						weight={this.state.element.weight}
						color={this.state.element.color}
						originalIndex={this.state.element.originalIndex}
						visible={this.state.element.visible}
						top={this.state.element.top}
						left={this.state.element.left}
					/>
				</Preview>
				<Sorter
					onSortByAll={this.handleFiltering.bind(this, 'all')}
					onSortByName={this.handleSorting.bind(this, 'name')}
					onSortBySymbol={this.handleSorting.bind(this, 'symbol')}
					onSortByNumber={this.handleSorting.bind(this, 'number')}
					onSortByOriginalOrder={this.handleSorting.bind(this, 'originalIndex')}
				/>
				<Filter
					onFilterShowAll={this.handleFiltering.bind(this, 'all')}
					onFilterMetal={this.handleFiltering.bind(this, 'metal')}
					onFilterTransition={this.handleFiltering.bind(this, 'transition')}
					onFilterIum={this.handleFiltering.bind(this, 'ium')}
				/>
				<List ref="element_list"
					elementList={this.state.elementList}
					elementListHeight={this.state.elementListHeight}
					onListResize={Helpers.debounce(this.handleListResize, 1000)}
				/>
			</div>
		)
	}
});

module.exports = ElementContainer;