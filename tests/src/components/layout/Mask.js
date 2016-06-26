import Mask from '../../../../src/components/layout/Mask'
import Modal from 'react-bootstrap/lib/Modal'

function setup() {
	let props = {
			show: false
		},
		wrapper = shallow(
			<Mask {...props}>
				<b>clild</b>
			</Mask>
		);

	return {
		props,
		wrapper
	}
}

describe('(component) Mask', () => {
	it('should render as a <Modal>', () => {
		const { wrapper } = setup()
		expect(wrapper.type()).to.eql(Modal);
		expect(wrapper.prop('backdrop')).to.eql('static');
		expect(wrapper.prop('keyboard')).to.be.false;
	});

	it('should have one icon font', () => {
		const { props, wrapper } = setup()
		expect(wrapper.find('i')).to.have.length(1);
	});

});
