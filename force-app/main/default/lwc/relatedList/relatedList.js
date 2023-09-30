import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getRecords from '@salesforce/apex/RelatedListController.getRecords';  

export default class RelatedList extends NavigationMixin(LightningElement) {
    // Auto filled properties
    @api recordId;  
    @api objectApiName;
    // Related List data properties
    @api targetObject;
    @api lookupField;
    @api parentField;
    @api fields;
    // Related List layout properties
    @api title;
    @api mode;
    @api columnNumber;
    @api density;
    @api displayNumber;
    // Private properties
    records;
    totalRecords = 0;

    get properties() {
        var properties = {
            recordId: this.recordId,
            objectApiName: this.objectApiName,
            targetObject: this.targetObject,
            lookupField: this.lookupField,
            parentField: this.parentField
        }

        return JSON.stringify(properties);
    }

    get displayFields() {
        return this.fields.split(',');
    }

    get displayTitle() {
        return this.title + ` (${this.totalRecords})`;
    }

    get displayRecords() {
        return this.records ? this.records.slice(0, this.displayNumber) : [];
    }

    connectedCallback() {
        console.log(this.fieldValue);
        getRecords({ jsonString: this.properties }).then(results => {
            this.records = results;
            this.totalRecords = this.records.length;
        });
    }

    viewRecord(event) {
        // Navigate to record page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                'recordId': event.target.dataset.value,
                'objectApiName': this.targetObject,
                'actionName': 'view'
            },
        });
    }

    editRecord(event) {
        // Open record edit form in pop-up modal
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                'recordId': event.target.dataset.value,
                'objectApiName': this.targetObject,
                'actionName': 'edit'
            },
        });
    }
}