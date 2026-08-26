### Latching
- records the apperance of a signal for later processing
- you have to clear the flip-flop after reading the latch so you can receive another signal
- a way a CPU can handle a latching is using a ISR, pooling, [[DMA]], [[Event System]]

### Edge versus Level Triggered
- Edge triggered means the event happens on transitions (rising/falling edges)
- Level triggered menas the event happens on a voltage threshold

### Tristate Logic
- multiples devices connected to the same bus, you throw the non used ones to high-z

# Wait States
- When the processor need to interface with slower peripheral you may add wait states on the bus cycles
- This degrades the overall systems performance, but preserve determinism because it assumes the acess takes the same ammount of time

[[CPU]]

[[Memory]]

[[Input/Output]]

[[Performance]]

[[Pipelining]]

[[Others]]

[[NON-VON-NEUMANN ARCHITECTURES]]







