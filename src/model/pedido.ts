import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./usuario";
import { ItemPedido } from "./item-pedido";

@Entity("pedidos")
export class Pedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos, {
    nullable: false,
    eager: true,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  usuario!: Usuario;

  @OneToMany(() => ItemPedido, (item) => item.pedido, {
    cascade: true,
    eager: true,
  })
  itens: ItemPedido[] = [];

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  total!: number;

  @CreateDateColumn({ name: "data_criacao" })
  dataCriacao!: Date;
}