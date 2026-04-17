import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./pedido";
import { Tenis } from "./tenis";

@Entity("itens_pedido")
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.itens, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  pedido!: Pedido;

  @ManyToOne(() => Tenis, {
    eager: true,
    nullable: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  tenis!: Tenis;

  @Column({ type: "int" })
  quantidade!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  precoUnitario!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  subtotal!: number;
}