import {TodoPage} from './todo-list.po';
import {browser, protractor} from 'protractor';

describe('angular-spark-lab', () => {
    let page: TodoPage;

    beforeEach(() => {
        page = new TodoPage();
    });

    it('should get and highlight Tasks attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Find your tasks:');
    });

    it('should type something in the Owner box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeAnOwner("Workman");
        page.toggleSearch();
        expect(page.getFirstTodo()).toEqual("Workman has completed this software design task:");
    });

    it('Should select a category and check that it returned correct element', () => {
        page.navigateTo();
        page.typeACategory('homework');
        expect(page.getFirstTodo()).toEqual("Fry has completed this homework task:");
    });

    it('Should select a category and check that it returned correct element', () => {
        page.navigateTo();
        page.typeACategory('software design');
        expect(page.getFirstTodo()).toEqual("Blanche has not completed this software design task:");
    });

    it('Should select a category and check that it returned correct element', () => {
        page.navigateTo();
        page.typeACategory('groceries');
        expect(page.getFirstTodo()).toEqual("Blanche has completed this groceries task:");
    });

    it('Should select a category and check that it returned correct element', () => {
        page.navigateTo();
        page.typeACategory('video games');
        expect(page.getFirstTodo()).toEqual("Fry has not completed this video games task:");
    });

    it('Should select true for status and have the completed todos appear on the page', () => {
        page.navigateTo();
        page.selectStatus('Complete');
        expect(page.getFirstTodo()).toEqual("Fry has completed this homework task:")
    });

    it('Should select false for status and have the incomplete todos appear on the page', () => {
        page.navigateTo();
        page.selectStatus('Incomplete');
        expect(page.getFirstTodo()).toEqual("Blanche has not completed this software design task:")
    });

    it('Should only return todos that contain particular content', () => {
        page.navigateTo();
        page.filterByContent('Excepteur');
        expect(page.getFirstTodo()).toEqual("Blanche has not completed this homework task:")
    });

    it('Should correctly return todos that are filtered by multiple properties', () => {
        page.navigateTo();
        page.filterByContent('velit');
        page.selectStatus('Complete');
        page.typeAnOwner('Workman');
        page.typeACategory('software design');
        page.toggleSearch();
        expect(page.getFirstTodo()).toEqual('Workman has completed this software design task:')
    });

    it('Should have an owner filter box', () => {
        page.navigateTo();
        expect(page.getFilterInterface('todoOwner')).toEqual("")
    });

    it('Should have an content filter box', () => {
        page.navigateTo();
        expect(page.getFilterInterface('content')).toEqual("")
    });

    /*
    Note that to make it easier to test the existence of the category and status dropdowns,
    we checked that an option inside of these elements was accessible.
     */


    it('Should have a status dropdown element', () => {
        page.navigateTo();
        expect(page.getFilterInterface('true')).toEqual("Complete")
    });

    it('Should have a Search button for submitting filters', () => {
        page.navigateTo();
        expect(page.getFilterInterface('load-button')).toEqual("Search");

    });
});
