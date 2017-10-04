import {browser, element, by} from 'protractor';
import {Key} from "selenium-webdriver";

export class TodoPage {
    navigateTo() {
        return browser.get('/todos');
    }

    //http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return "highlighted";
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodoTitle() {
        let title = element(by.id('list-title')).getText();
        this.highlightElement(by.id('list-title'));

        return title;
    }

    typeAnOwner(name: string) {
        let input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(name);

    }

    /*
    We credit Ethan again with helping us to get the end to end
    testing to recognize when a filter has been selected from a dropdown.
     */
    typeACategory(category: string) {
        let input = element(by.id('categories'));
        input.click();
        input.sendKeys(category);

    }

    selectStatus(status: string) {
        let input = element(by.id('status'));
        input.click();
        input.sendKeys(status);
        this.pressEnter();
    }


    filterByContent(content: string) {
        let input = element(by.id('content-search'));
        input.click();
        input.sendKeys(content);
    }

    toggleSearch() {
        let input = element(by.id('load-button'));
        input.click();

    }

    pressEnter() {
        browser.actions().sendKeys(Key.ENTER).perform();
    }


    getFilterInterface(ui: string) {
        let userInterface = element(by.id(ui)).getText();
        this.highlightElement(by.id(ui));

        return userInterface;
    }


    getFirstTodo() {
        let todo = element(by.id('subject-line')).getText();
        return todo;
    }

    addTodo(owner:string,status:string,body:string,category:string) {
        let ownerField = element(by.id("add-owner"));
        let statusButton = element(by.id(status));
        let bodyField = element(by.id("add-content"));
        let categoryField = element(by.id("add-category"));
        let addButton = element(by.id("make-todo"))
        ownerField.click();
        ownerField.sendKeys(owner);
        statusButton.click();
        bodyField.click();
        bodyField.sendKeys(body);
        categoryField.click();
        categoryField.sendKeys(category);
        addButton.click();
    }
    countTodosOnScreen(){
        let todoList = element(by.id("todos"));

    }

}
