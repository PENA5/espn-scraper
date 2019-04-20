$(document).ready(() => {
    console.log("in article show");
    $('.modal-trigger').hide(); 
    var id = $(this).data("id");


    $('#newNote').modal();
    $('.modal-content').modal();
    $('select').material_select();
    
    $('.create-note').on('click', function () {
        console.log("in create note");
        $('#newNote').modal('open');

        $('#saveNote').on('click', function () {

            console.log("in save note");

            var articleId = $(this).data("id");
            
            const note = {};
            note.title = $('#note-title').val().trim();
            note.body = $('#note-body').val().trim();

            console.log("NEW NOTE\n");
            console.log(note);


            $.ajax({
                    method: "POST",
                    url: "/notes/" + articleId,
                    data: note
                })
                .done(function () {
                    

                    $('#note-title').val(note.title);
                    $('#note-body').val(note.body);
                    window.location.reload();
                    Materialize.toast('Note Saved!', 4000)

                });
        });
    });



    // edit Note
    $(".note-see").on('click', function () {
        var id = $(this).data("id");
        console.log("note edit");

        $.ajax({
                method: "GET",
                url: "/notes/" + id
            })
            .done(function (note) {
                console.log("NOTE INFO\n\n" + JSON.stringify(note));

                $('#note-title').val(note.title);
                $('#note-body').val(note.body);

                $('#newNote').modal('open');
                
                $('#saveNote').on('click', function () {

                    console.log("in edit save note");
                    note.title = $('#note-title').val().trim();
                    note.body = $('#note-body').val().trim();
                    console.log("Edit NOTE\n");
                    console.log(note);
                    $.ajax({
                            method: "PUT",
                            url: "/notes/" + note._id,
                            data: note
                        })
                        .done(function () {
                            //update elements without reloading page
        
                            $('#note-title').val(note.title);
                            $('#note-body').val(note.body);
                            Materialize.toast('Note Saved!', 4000)
                            window.location.reload();
        
                        });
                });


            });
    });


    //DELETE EVENT

    $(".note-delete").on('click', function () {
        var noteid = $(this).data("noteid");
        var articleid = $(this).data("articleid");
        
        console.log("note-delete");
        $.ajax({
                method: "DELETE",
                url: "/notes/" + noteid + "/" + articleid
            })
            .done(function (note) {
                window.location.reload();
                console.log("Article INFO\n\n" + JSON.stringify(note));
            });

    });

});