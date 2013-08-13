var expect = chai.expect;
describe('Fluent', function() {
	it('can initialize with document', function() {
		expect($(document).length).to.equal(new Fluent(document).length);
	});
});