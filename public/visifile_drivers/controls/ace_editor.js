function(args) {
/*
is_app(true)
component_type("VB")
display_name("Ace Editor component")
description("This will return the Ace editor component")
base_component_id("ace_editor")
visibility("PRIVATE")
read_only(true)
load_once_from_file(true)
properties(
    [
        {
            id:     "label",
            name:   "Label",
            type:   "String"
        }
        ,
        {
            id:     "placeholder",
            name:   "Placeholder",
            type:   "String"
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,
        {
            id:     "value",
            name:   "Value",
            type:   "String",
            textarea: true
        }
        ,
        {
            id:         "setValue",
            snippet:    `setValue("hello World")`,
            name:       "setValue(...)",
            type:       "Action"
        }
        ,
        {
            id:         "gotoLine",
            snippet:    `gotoLine(1)`,
            name:       "gotoLine(...)",
            type:       "Action"
        }
        ,
        {
            id:         "getRow",
            pre_snippet: `await `,
            snippet:    `getRow()`,
            name:       "getRow()",
            type:       "Action"
        }
        ,
        {
            id:         "getColumn",
            pre_snippet: `await `,
            snippet:    `getColumn()`,
            name:       "getColumn()",
            type:       "Action"
        }
        ,


        {
            id:     "useZeroBasedIndex",
            name:   "Use Zero based Index?",
            type:       "Select",
            default:    "False",
            values:     [
                            {display: "True",  value: "True"},
                            {display: "False",  value: "False"}


                        ]
        }
        ,

        {
            id:     "click_event",
            name:   "Clicked event",
            type:   "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                         </div>`
        }
        ,
        {
            id:     "focus_event",
            name:   "Focus event",
            type:   "Event",
            help:       `<div>Help text for
                            <b>focus_event</b> event
                         </div>`
        }
        ,
        {
            id:     "keypress_event",
            name:   "Key pressed event",
            type:   "Event",
            help:       `<div>Help text for
                            <b>key_pressed</b> event
                         </div>`
        }
        ,
        {
            id:     "last_keypressed",
            name:   "Last key pressed",
            type:   "String"
        }
        ,        {
            id:         "width",
            name:       "Width",
            default:    300,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    150,
            type:       "Number"
        }
        ,


        {
            id:     "border_color",
            name:   "Border color",
            type:   "String",
            default: "black"
        }
        ,
        {
            id:     "border_width_px",
            name:   "Border width px",
            type:   "Number",
            default: 1
        }
        ,

        {
            id:     "padding_px",
            name:   "Padding px",
            type:   "Number",
            default: 0
        }
        ,

        {
            id:     "mouseX",
            name:   "Mouse X",
            type:   "Number",
            default: 0
        }
        ,

        {
            id:     "mouseY",
            name:   "Mouse Y",
            type:   "Number",
            default: 0
        }

    ]
)//properties
logo_url("/driver_icons/ace_editor.jpeg")
*/
    Vue.component("ace_editor",{
      props: [ "meta", "form",  "name", "args", "refresh", "design_mode"]
      ,
      template: `<div>
                    <div v-if='!design_mode'>
                        <label v-if='args.label'>{{args.label}}</label>

                        <div    v-bind:style='"height:100%;width:100%; " +
                                              "border-color: "       +     args["border_color"]  + ";" +
                                              "border: "             +    (design_mode?0:args["border_width_px"])  + "px;" +
                                              "background-color: "   +     args["background_color"]  + ";" +
                                              "padding: "            +     args["padding_px"]  + ";" +
                                              "border-style: solid;"'

                                 v-on:mousemove='var rect = event.target.getBoundingClientRect();var x = event.clientX - rect.left; var y = event.clientY - rect.top;args.mouseX = x;args.mouseY  = y;'
                        >
                            <div    v-bind:id='editorName'
                            >
                            </div>
                        </div>
                    </div>

                    <div v-if='design_mode'>
                        <img src="/driver_icons/ace_editor.jpeg" width=100px></src>
                    </div>
                 </div>`
      ,
      watch: {
        // This would be called anytime the value of the input changes
        args: function(newValue, oldValue) {

            //console.log("refresh: " + this.args.text)
            if (isValidObject(this.args)) {

                //alert(JSON.stringify(this.tables,null,2))
            }
        }
      }
      ,
      mounted: function() {
        registerComponent(this)
        var mm = this
        if (mm.name) {
            //debugger
            this.editorName = '_' + mm.name
            ace.config.set('basePath', '/');
            setTimeout(function(){
                mm.editorElement = ace.edit( mm.editorName,
                                                {
                                                       selectionStyle:  "text",
                                                       mode:            "ace/mode/javascript"
                                                })

                document.getElementById(mm.editorName).style["font-size"]    = "16px"
                document.getElementById(mm.editorName).style.width           = "100%"
                document.getElementById(mm.editorName).style.border          = "0px solid #2C2828"
                document.getElementById(mm.editorName).style.height          = "100%"
                if (mm.args.value) {
                    mm.editorElement.getSession().setValue(mm.args.value);
                }
                mm.editorElement.getSession().setUseWorker(false);
                setTimeout(function(){
                    mm.editorElement.setTheme("ace/theme/sqlserver");
                },200)

                mm.editorElement.getSession().on('change', function() {
                   mm.args.value = mm.editorElement.getSession().getValue();
                })
                testObject = mm.editorElement
            },100)

        }
      }
      ,
      data: function() {
          return {
              editorName:  null,
              editorElement: null
          }
      }
      ,



      methods: {
            setValue(x) {
                if (x) {
                    this.editorElement.setValue(x);
                } else {
                    this.editorElement.setValue(this.args.value);
                }
            }
            ,


            gotoLine: function(line) {
                debugger
                var addNum = 0
                if (this.args.useZeroBasedIndex && (this.args.useZeroBasedIndex == "True")) {
                    addNum = 1
                }
                this.editorElement.gotoLine(line + addNum, 0, true);
            }
            ,
            getRow: function() {
                debugger
                var addNum = 1
                if (this.args.useZeroBasedIndex && (this.args.useZeroBasedIndex == "True")) {
                    addNum = 0
                }
                var row =  (this.editorElement).getCursorPosition();
                return row.row + addNum;
            }
            ,
            getColumn: function() {
                debugger
                 var addNum = 1
                 if (this.args.useZeroBasedIndex && (this.args.useZeroBasedIndex == "True")) {
                     addNum = 0
                 }
                 var column =  (this.editorElement).getCursorPosition();
                 return column.column + addNum
            }
            ,
            click_event_callback: function() {
                //console.log("----- button_control, click_event_callback: function() = " + this.name)
                //eval("(function(){" + this.args.click_event + "})")()

                this.$emit('send', {
                                                type:               "subcomponent_event",
                                                form_name:           this.meta.form,
                                                control_name:        this.meta.name,
                                                sub_type:           "click",
                                                code:                this.args.click_event
                                            })

            }
            ,
            keypress_event_callback: function(mykeypressed) {
                //console.log("----- button_control, click_event_callback: function() = " + this.name)
                //eval("(function(){" + this.args.click_event + "})")()
                //this.args.last_keypressed = JSON.parse(JSON.stringify(mykeypressed))
                console.log("mykeypressed: "+ mykeypressed)

                this.args.last_keypressed = mykeypressed
                this.$emit('send', {
                                                type:               "subcomponent_event",
                                                form_name:           this.meta.form,
                                                control_name:        this.meta.name,
                                                sub_type:           "keypress",
                                                code:                this.args.keypress_event
                                            })

            }
            ,
            focus_event_callback: function() {
                console.log("----- button_control, focus_event_callback: function() = " + this.name)

                this.$emit('send', {
                                                type:               "subcomponent_event",
                                                form_name:           this.meta.form,
                                                control_name:        this.meta.name,
                                                sub_type:           "focus",
                                                code:                this.args.focus_event
                                            })

            }
       }
    })
}
