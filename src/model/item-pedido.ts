import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Pedido } from "./pedido";
import { Tenis } from "./tenis";

@Entity("itens_pedido")
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.itens, {
    nullable: false,
  })
  pedido!: Pedido;

  @ManyToOne(() => Tenis, {
    eager: true,
    nullable: false,
  })
  tenis!: Tenis;

  @Column({ type: "int" })
  quantidade!: number;
}