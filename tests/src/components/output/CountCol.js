import CountCol from '../../../../src/components/output/CountCol';

function setup() {
	let props = {
			header: 'header',
			onClick: sinon.spy(),
			count: 5,
			desc: 'description'
		},
		wrapper = shallow(<CountCol {...props}/>);

	return {
		props,
		wrapper
	}
}

describe('(component) CountCol', () => {
	it('should render as a <Col>', () => {
		const { wrapper } = setup()
		expect(wrapper.type().displayName).to.eql('Col');
	});

	describe('child: heading', () => {
		it('should render with .panel-heading', () => {
			const { wrapper } = setup()
			expect(wrapper.find('.panel-heading')).to.have.length(1);
		});

		it('should contain \'header\'', () => {
			const { wrapper } = setup()
			expect(wrapper.find('.panel-heading').find('.pull-left').props().children).to.be.equal('header');
		});

		describe('child: Glyphicon', () => {
			it('should call onClick() if it is clicked', () => {
				const { props, wrapper } = setup()
				wrapper.find('.panel-heading').find('Glyphicon').simulate('click');
				expect(props.onClick).calledOnce;
			});
		});
	});

	describe('child: count', () => {
		it('should render with .row', () => {
			const { wrapper } = setup()
			expect(wrapper.find('.row')).to.have.length(1);
		});

		it('should show count', () => {
			const { props, wrapper } = setup()
			expect(wrapper.find('.huge').contains(
				<b>{props.count}</b>
			)).to.be.true;
		});
	});
});
