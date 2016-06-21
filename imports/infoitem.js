/**
 * Created by felix on 09.05.16.
 */

import { Topic } from './topic'
import { _ } from 'meteor/underscore';

/**
 * A InfoItem is a sub-element of
 * a topic which has a subject,
 * a date when is was created
 * and a list of associated tags.
 */
export class InfoItem {

    constructor(parentTopic, source) {
        if (!parentTopic || !source)
            throw new Meteor.Error("It is not allowed to create a InfoItem without the parentTopicId and the source");

        this._parentTopic = undefined;
        this._infoItemDoc = undefined;

        if (typeof parentTopic === 'object') {   // we have a topic object here.
            this._parentTopic = parentTopic;
        }
        if (!this._parentTopic) {
            throw new Meteor.Error("No parent Topic given!");
        }

        if (typeof source === 'string') {   // we may have an ID here.
            // Caution: findInfoItem returns a InfoItem-Object not the document itself!
            let infoItem = this._parentTopic.findInfoItem(source);
            source = infoItem._infoItemDoc;
        }

        if (!source.hasOwnProperty('createdInMinute')) {
            throw new Meteor.Error('Property createdInMinute of topicDoc required');
        }

        _.defaults(source, {
            itemType: 'infoItem',
            isSticky: false,
            labels: []
        });
        this._infoItemDoc = source;
    }

    // ################### static methods
    static isActionItem(infoItemDoc) {
        return (infoItemDoc.itemType === 'actionItem');
    }

    // ################### object methods
    invalidateIsNewFlag() {
        // a normal info item has no isNew-Flag so it is nothing to do here
    }

    isSticky() {
        return this._infoItemDoc.isSticky;
    }

    toggleSticky() {
        this._infoItemDoc.isSticky = !this.isSticky();
    }

    save(callback) {
        // caution: this will update the entire topics array from the parent minutes of the parent topic!
        this._parentTopic.upsertInfoItem(this._infoItemDoc, callback);
    }

    getParentTopic() {
        return this._parentTopic;
    }

    isActionItem() {
        return InfoItem.isActionItem(this._infoItemDoc);
    }

    getLabelsRawArray() {
        if (!this._infoItemDoc.labels) {
            return [];
        }
        return this._infoItemDoc.labels;
    }

    toString () {
        return "InfoItem: " + JSON.stringify(this._infoItemDoc, null, 4);
    }

    log () {
        console.log(this.toString());
    }

}