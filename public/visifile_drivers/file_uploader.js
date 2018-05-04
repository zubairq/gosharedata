{
    doc_type: 'visifile'
    ,
    name: 'fileuploader'
    ,
    version: 1
    ,
    type: 'basic'
    ,
    text: 'File Uploader'

    ,
    initText: 'file uploader is ALIVE!!!!'
    ,
    events: {


        "This function is when a file is uploaded to the system":
        {
            on: {
                where: "tags like '%||  UPLOAD  ||%'"
            },
            do: function(records, returnfn) {
                //console.log("1) In File Uploader, calling  a query")
                //console.log("2) " + JSON.stringify(records,null,2))
                var record =   getFirstRecord(records)
                var fullFilePath = getProperty(record,"path")
                //console.log("3) " + JSON.stringify(fullFilePath,null,2))
                //console.log("4) getFileExtension=" + getFileExtension(fullFilePath))
                findDriverWithMethod(   "can_handle_" + getFileExtension(fullFilePath)
                                        ,
                                        function(driverName) {

                                            if (driverName) {
                                                //console.log("5) Driver:" + driverName)
                                                callDriverMethod( driverName,
                                                                  "can_handle_" + getFileExtension(fullFilePath),
                                                                  {fileName: fullFilePath}
                                                            ,
                                                            function(result) {
                                                                //console.log("3) returned result: " + JSON.stringify(result,null,2))
                                                                 var sha1ofFileContents = createHashedDocumentContent(fullFilePath, getFileExtension(fullFilePath))
                                                                saveDocumentContent(sha1ofFileContents,result)
                                                                setStatus(record, "SAVED")
                                                                addTag(record, "DOCUMENT")
                                                                setProperty(record, "hash", sha1ofFileContents)
                                                                setName(record, getFileName(fullFilePath))

                                                                returnfn()
                                                            })

                                            } else {
                                                console.log("5) No driver can handle: " + getFileExtension(fullFilePath))
                                                setStatus(record, "ERROR")
                                                returnfn()
                                            }

                })


                        },
            end: null
        },

    }

}
