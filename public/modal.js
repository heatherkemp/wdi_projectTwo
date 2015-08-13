console.log('modal.js is linked');

$('#newTopicButton').on('click', function(){
    console.log('You clicked me!');
    $('#modal').toggle();
});

$('#closeModal').on('click', function(){
    $('#modal').toggle();
});