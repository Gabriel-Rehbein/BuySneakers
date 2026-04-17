import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Usuario } from "./usuario";
import { ItemPedido } from "./item-pedido";

@Entity("pedidos")
export class Pedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos, {
    nullable: false,
    eager: true,
  })
  usuario!: Usuario;

  @OneToMany(() => ItemPedido, (item) => item.pedido, {
    cascade: true,
    eager: true,
  })
  itens: ItemPedido[] = [];
}