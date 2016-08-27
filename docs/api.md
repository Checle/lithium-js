# Record JS API

## Stream

The record JS stream interface extends the [Node.js duplex stream interface](https://nodejs.org/api/stream.html#stream_implementing_a_duplex_stream) by the methods listed hereinafter. It this way, it bundles access to the readable interface of the record input stream and the writable interface of the output stream.

### Behavior

![Duplex stream](./duplex.png?raw=true)

Record input and output streams are exposed to a JS contract API as a Node.js duplex stream. These streams correspond to `stdin` and `stdout`, respectively, of the POSIX interface.

A base contract receives the record stream as first argument. All data required for verification of the contract is queued at runtime as received by a peer and, thus, available for `record.read()` at runtime. A contract, however, may read and write data by means of event listeners beyond the runtime of its initial tick.

Base contracts can assume the role of splitting input data into separate arguments and forward these to target contracts via recursion.

#### Output stream

The output stream represents the current record instance's path in the record tree. Before execution of a program, this is the absolute path of the record currently being evaluated and can be examined by the program as such. After a tick, the content of the stream represents the target path. In a consecutive iteration, it represents the head of the input data and thus, additional input is being forwarded to the target.

In case the output path falls within the scope of the current record's input data itself (e.g., written data is a prefix of read data), this output creates a new key pointing the record (due to recursion).

A record is addressable by

* the full exact path produced by its output,
* its full exact content or
* a prefix of its input content beginning with its path such that the remainder portion of its input content compares less to any other records with the same prefix.

### Methods

#### record(...inputs)

Branches the record and pushes `inputs` one by one to the input queue of the branch. Causes selection of the beginning inputs and an execution of consecutive inputs, if applicable. Returns the resulting record.

#### record.toString()

The `record.toString()` method concatenates all queued input data in a single string. It alters neither the input queue nor the file offset. 

#### record.valueOf()

The `record.toString()` method concatenates all queued input data in a single buffer. It alters neither the input queue nor the file offset.

#### record.seek([offset])

The `record.seek()` method moves the position of the input stream cursor by `offset` relative bytes and returns its new position. The cursor is placed at the end of the output stream if `offset` is `null`.

#### get record.path

Gets the complete output stream as string.

#### set record.path

Sets the output stream content to the string representation of the new value.

#### get record.length

Gets the number of bytes on the input queue.

#### set record.length

Crops or elongates the input queue at its end. Possibly annexed bytes are initialized to zero.
