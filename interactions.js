interact('.draggable')
    .draggable({
        // allow dragging of multple elements at the same time
        max: Infinity,

        // call this function on every dragmove event
        onmove: function (event) {
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
            target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
            
            textEl && (textEl.textContent =
                'moved a distance of '
                + (Math.sqrt(event.dx * event.dx +
                             event.dy * event.dy)|0) + 'px');
        }
    })
    // enable inertial throwing
    .inertia(true)
    // keep the element within the area of it's parent
    .restrict({
        drag: "parent",
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    })
    .snap({
    mode: 'path',
    paths: [function (x, y) {
      var dropzoneRect = interact.getElementRect(document.getElementById('dropzone'));

      if (x >= dropzoneRect.left && x <= dropzoneRect.right
          && y >= dropzoneRect.top && y <= dropzoneRect.bottom) {
        return {
          x: dropzoneRect.left + dropzoneRect.width / 2,
          y: dropzoneRect.left + dropzoneRect.height / 2,
          range: Infinity
        }   
      }   

      return { x: x, y: y };

    }], 
    range: Infinity,
    elementOrigin: { x: 0.5, y: 0.5 },// Set Origin to center for snapping to position
    endOnly: true
});
    /*.snap({
            mode: 'anchor',
            anchors: [],
            range: Infinity,
            elementOrigin: { x: 0.5, y: 0.5 },// Set Origin to center for snapping to position
            endOnly: true
        })*/
        
   // ;

    // allow more than one interaction at a time
    interact.maxInteractions(Infinity);
    
/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '#yes-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,

    // listen for drop related events:

    ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
        draggableElement.textContent = 'Dragged in';
        
        var dropRect = interact.getElementRect(event.target),
        dropCenter = {
          x: dropRect.left + dropRect.width  / 2,
          y: dropRect.top  + dropRect.height / 2
        };
        console.log('dropCenter', dropCenter);
        event.draggable.snap({
            anchors     : [dropCenter]                
        });
    },
    ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        event.relatedTarget.textContent = 'Dragged out';
        event.draggable.snap(false);
    },
    ondrop: function (event) {
        event.relatedTarget.textContent = 'Dropped';
    },
    ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
    }
});