1. Idle cursor moves to the beginning of the text upon state change induced by another user's changes.

2. Latency with WebSocket causes change-inducer's cursor to move to position zero when request rate is high.

3. OT / CRDT concurrency issues (yet to be observed and analyzed).

4. WebSocket server disconnects frequently.