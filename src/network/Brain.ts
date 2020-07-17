import Node from './Node';
import Connection from './Connection';

export default class Brain {

  private _network: Node[][] = [];
  private _connections: Connection[] = [];
  private _nodes: Node[] = [];

  public createLayers(layers: number[]) {
    let i: number;
    let j: number;
    let k: number;
    for(i=0; i < layers.length; i++) {
      this._network[i] = [];
      for(j=0; j < layers[i]; j++) {
        this._network[i][j] = new Node();
        this._nodes.push(this._network[i][j]);
      }
    }
    for(i=1; i < this._network.length; i++) {
      for(j=0; j < this._network[i].length; j++) {
        for(k=0; k < this._network[i-1].length; k++) {
          this._network[i][j].setInput(k, this._network[i-1][k].getOutput(j));
          this._connections.push(this._network[i-1][k].getOutput(j));
        }
      }
    }
  }

  public randomize(): void {
    for(let i: number=0; i < this._network.length; i++) {
      for(let j: number=0; j < this._network[i].length; j++) {
        this._network[i][j].randomize();
      }
    }
  }

  public getNode(layer: number, index: number): Node {
    if(!this._network[layer] || !this._network[layer][index]) {
      throw new Error(`Node not found (${layer}:${index})`);
    }
    return this._network[layer][index];
  }

  public get layerCount(): number {
    return this._network.length;
  }

  public get connectionCount(): number {
    return this._connections.length;
  }

  public get nodeCount(): number {
    return this._nodes.length;
  }

  public getLayerSize(index: number): number {
    if(!this._network[index]) {
      return 0;
    }
    return this._network[index].length;
  }

  public process(input: number[]): number[] {
    let i: number;
    let result: number[] = [];
    for(i=0; i < input.length; i++) {
      this.getNode(0, i).getInput(0).input = input[i];
    }
    for(i=0; i < this._nodes.length; i++) {
      this._nodes[i].process();
    }
    let lastLayer: Node[] = this._network[this._network.length-1];
    for(i=0; i < lastLayer.length; i++) {
      result.push(lastLayer[i].getOutput(0).process());
    }
    return result;
  }

}
