
var util = require('bookeditor:static/js/util.js'),
    M = util.mediator;

window.ue = UE.getEditor('editor', {
    initialFrameWidth: '100%',
    initialFrameHeight: '100%'
});

ue.addListener('ready', function(){
    M.fire('w:editor:ready', {
        ue: ue
    });
});

module.exports = exports = {
    getContent: function(){
        return ue.getContent();
    },

    getWkContent: function(){
        return ue.getWkContent();
    },

    getSectionList: function(){
        return ue.getSectionList();
    },

    getSections: function(){
        return ue.getSections()
    },

    toSection: function(index){
        ue.toSection(index);
    },

    setWkContent: function  (data) {
        ue.setWkContent(data);
    },

    getWkJsonContent: function  () {
        return ue.getWkJsonContent();
    }
    
};