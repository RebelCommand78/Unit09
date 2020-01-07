$(document).ready(function () {

  $.ajax({
      url: "/api/notes",
      method: "GET"
    })
    .then(function (notes) {
      console.log(notes);
      notes.forEach((note, index) => {

        const noteObj = {
          id: note.id,
          title: note.title,
          content: note.content,
          created: moment(note.date_creation).format("YYYY-MM-DD h:mm:ss a"),
          updated: moment(note.last_modification).format("YYYY-MM-DD h:mm:ss a")
        }

        const $card = $("<card>");


        const $cardheader = $(`<div class='card-header text-align' id='heading${index+1}'>`);

        const $row = $("<div class='row align-items-center'>");
        const $colTitle = $("<div class='col-2 d-flex align-content-start'>");
        const $colDates = $("<div class='col-8 d-flex align-content-start'>");
        const $colActions = $("<div class='col-2 d-flex justify-content-end'>");

        const $buttonTitle = $(
          `<button class='btn btn-link' type='button' 
                              data-toggle='collapse' data-target='#note${index+1}'
                              aria-expanded='false' aria-controls='note${index+1}'
                              style='color: black; font-weight: bold; text-decoration: none'>`
        ).text(note.title).appendTo($colTitle);

        const $spanCreated = $("<span class='mr-2'>").text("Created :").appendTo($colDates);
        const $spanCreatedContent = $("<span style='font-weight: bold'>").text(` ${moment(note.date_creation).format("ddd, MMM Do YYYY, h:mm a")}`).appendTo($colDates);
        const $spanLastAccess = $("<span class='mx-2'>").text("Last access :").appendTo($colDates);
        const $spanLastAccessContent = $("<span style='font-weight: bold'>").text(`  ${moment(note.last_modification).format("ddd, MMM Do YYYY, h:mm a")}`).appendTo($colDates);

        const $update = $("<span class='fas fa-edit text-warning'>").appendTo($colActions);

        const $delete = $("<span class='fas fa-trash-alt text-danger'>").appendTo($colActions);

        $update
          .attr("id", "update")
          .attr("data-toggle", "modal")
          .attr("data-target", "#update-modal");

        $delete
          .attr("id", "delete")
          .attr("data-toggle", "modal")
          .attr("data-target", "#delete-modal");

        $update.data("data-note", note);
        $delete.data("data-note", note);

        $row.append($colTitle, $colDates, $colActions);
        $cardheader.append($row);


        const $divCollapse = $(
          `<div id='note${index+1}' aria-labelledby='heading${index+1}' data-parent='#accordion'>`);

        (index === 0) ? $divCollapse.addClass("collapse show"): $divCollapse.addClass("collapse");

        const $cardBody = $("<div class='card-body'>");
        $cardBody.text(note.content).appendTo($divCollapse);

        $card.append($cardheader, $divCollapse).appendTo("#accordion");
      });
    });

  $("#add-note").on("click", (event) => {

    event.preventDefault();

    const newNote = {
      title: $("#title-input").val().trim(),
      content: $("#content-input").val().trim(),
      date_creation: moment().format("YYYY-MM-DD HH:mm:ss"),
      last_modification: moment().format("YYYY-MM-DD HH:mm:ss")
    };
    console.log(newNote);

    $.ajax({
      url: "/api/notes",
      method: "POST",
      data: newNote
    }).then(data => {

      alert("Note Saved Successfully!");

      $("#title-input").val("");
      $("#content-input").val("");

      location.reload();
    });
  });

  $(document).on("click", "#update", function () {

    const updateNote = $(this).data("data-note");

    $("#title-modal").val(updateNote.title);
    $("#content-modal").val(updateNote.content);

    $(document).on("click", "#confirm-update", function (event) {

      const updateData = {
        id: updateNote.id,
        title: $("#title-modal").val(),
        content: $("#content-modal").val(),
        last_modification: moment().format("YYYY-MM-DD HH:mm:ss")
      };

      console.log(updateData);

      $.ajax({
        url: "/api/notes/" + updateNote.id,
        method: "PUT",
        data: updateData
      }).then(data => {

        alert("Note Updated Successfully!");

        $("#update-modal").modal("dispose");

        location.reload();
      });
    });
  });

  $(document).on("click", "#delete", function () {

    const deleteNote = $(this).data("data-note");

    console.log(deleteNote);

    $(document).on("click", "#confirm-delete", function (event) {

      $.ajax({
        url: "/api/notes",
        method: "DELETE",
        data: deleteNote
      }).then(data => {

        alert("Note Successfully deleted!");

        location.reload();
      });

    });

  });

  $("#search").on("click", (event) => {

    event.preventDefault();

    const searchValue = $("#search-input").val().trim();

    console.log(searchValue);
    console.log("----------");
    console.log(`/api/notes/${searchValue}`)
    $.ajax({
        url: "/api/notes/" + searchValue,
        method: "GET",

      })
      .then(function (notesFound) {


        alert(`${notesFound.length} note(s) found!`);

        $("#search-input").val("");

        location.reload();
      });
  });

});