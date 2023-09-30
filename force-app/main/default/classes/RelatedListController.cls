public with sharing class RelatedListController {
    @AuraEnabled
    public static List<sObject> getRecords(String jsonString) {
        Properties properties = (Properties) System.JSON.deserialize(jsonString, Properties.class);

        Id lookupRecordId = getLookupRecordId(properties);
        String query = 'SELECT Id, Name FROM ' + properties.targetObject + ' WHERE ' + properties.lookupField + ' = :lookupRecordId ORDER BY CreatedDate ASC';

        return Database.query(query);
    }

    private static Id getLookupRecordId(Properties properties) {
        if (properties.parentField == null) {
            return (Id) properties.recordId;
        } 
        else {
            Id recordId = properties.recordId;

            List<SObject> objs = Database.query(
                'SELECT ' + properties.parentField +
                ' FROM ' + properties.objectApiName + 
                ' WHERE Id = :recordId'
            );

            return (Id) objs[0].get(properties.parentField);
        }
    }

    public class Properties {
        public String recordId;
        public String objectApiName;
        public String targetObject;
        public String lookupField;
        public String parentField;
    }
}